import React, { useEffect, useRef, useState } from 'react';
import type { FaceLandmarker } from '@mediapipe/tasks-vision';
import {
  ArrowRight, Camera, Image as ImageIcon, RotateCcw, Share2, Calendar, Eye, EyeOff,
  Glasses, RefreshCw, ShieldCheck, Move, X, Loader2, ScanFace, Video,
} from 'lucide-react';
import { TRY_ON_FRAMES, TryOnFrame } from '../data/tryOnFrames';
import { fetchFrames } from '../utils/framesApi';
import {
  loadFaceLandmarker, poseFromLandmarks, hingePoints, FacePose, PoseFilter, Point,
} from '../utils/faceTracker';
import logoImg from '../assets/images/logo_optics.svg';

interface TryOnPageProps {
  onBackToMain: () => void;
  onBookAppointment: () => void;
}

// מיקום המשקפיים על תמונה באחוזים מהתמונה (מרכז, רוחב) וזווית במעלות.
// ears – נקודות האוזניים באחוזים (מצילום חי בלבד); null = הידית מוסתרת מאחורי הראש.
interface Placement {
  x: number;
  y: number;
  width: number;
  rotation: number;
  ears?: { left: Point | null; right: Point | null };
}

interface Segment {
  from: Point;
  to: Point;
}

type Mode = 'intro' | 'live' | 'photo';
type TrackerStatus = 'idle' | 'loading' | 'ready' | 'failed';

const DEFAULT_PLACEMENT: Placement = { x: 50, y: 42, width: 56, rotation: 0 };
const MIN_WIDTH = 20;
const MAX_WIDTH = 95;
const MAX_PHOTO_SIDE = 1400;
const MAX_YAW = 0.9;
const MAX_PITCH = 0.35;
// מעבר לזווית הזו הידית בצד הרחוק מוסתרת מאחורי הראש
const HIDE_TEMPLE_YAW = 0.3;
const TEMPLE_THICKNESS = 0.028;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const toDeg = (rad: number) => (rad * 180) / Math.PI;

// ידיות בתמונה סטטית, בפיקסלים של התמונה
function photoTemples(placement: Placement, frame: TryOnFrame, w: number, h: number): Segment[] {
  if (!placement.ears) return [];
  const width = (placement.width / 100) * w;
  const hinges = hingePoints(
    { x: (placement.x / 100) * w, y: (placement.y / 100) * h },
    width,
    frame,
    (placement.rotation * Math.PI) / 180,
  );
  const toPx = (p: Point) => ({ x: (p.x / 100) * w, y: (p.y / 100) * h });
  const out: Segment[] = [];
  if (placement.ears.left) out.push({ from: hinges.left, to: toPx(placement.ears.left) });
  if (placement.ears.right) out.push({ from: hinges.right, to: toPx(placement.ears.right) });
  return out;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    // תמונות מסגרות מאחסון חיצוני – בלי זה הקנבס "מזוהם" ואי אפשר לשמור את התמונה
    if (/^https?:/.test(src)) img.crossOrigin = 'anonymous';
    img.src = src;
  });

export const TryOnPage: React.FC<TryOnPageProps> = ({ onBackToMain, onBookAppointment }) => {
  const [mode, setMode] = useState<Mode>('intro');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState({ w: 1, h: 1 });
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [trackerStatus, setTrackerStatus] = useState<TrackerStatus>('idle');
  const [faceFound, setFaceFound] = useState(false);
  const [liveSize, setLiveSize] = useState(100);
  const [frames, setFrames] = useState<TryOnFrame[]>(TRY_ON_FRAMES);
  const [selected, setSelected] = useState<TryOnFrame | null>(TRY_ON_FRAMES[0]);
  const [placement, setPlacement] = useState<Placement>(DEFAULT_PLACEMENT);
  const [comparing, setComparing] = useState(false);
  const [saving, setSaving] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const liveStageRef = useRef<HTMLDivElement>(null);
  const liveGlassesRef = useRef<HTMLImageElement>(null);
  const templeLeftRef = useRef<SVGLineElement>(null);
  const templeRightRef = useRef<SVGLineElement>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const poseRef = useRef<FacePose | null>(null);
  const liveSizeRef = useRef(liveSize);
  liveSizeRef.current = liveSize;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // מחוות גרירה / צביטה על תמונה
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    placement: Placement;
    center: { x: number; y: number };
    dist: number;
    angle: number;
  } | null>(null);
  const placementRef = useRef(placement);
  placementRef.current = placement;

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => stopCamera, []);

  // מסגרות שהועלו ממסך ההגדרות מחליפות את מסגרות הדוגמה
  useEffect(() => {
    fetchFrames()
      .then(({ frames: uploaded }) => {
        if (!uploaded.length) return;
        setFrames(uploaded);
        setSelected((cur) => (cur && uploaded.some((f) => f.id === cur.id) ? cur : uploaded[0]));
      })
      .catch(() => {
        // בלי חיבור לשרת – נשארים עם מסגרות הדוגמה
      });
  }, []);

  const startLive = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      // דפדפן ללא גישה ישירה למצלמה – פותחים את מצלמת הסלפי של המכשיר
      selfieInputRef.current?.click();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      poseRef.current = null;
      setFaceFound(false);
      setPhoto(null);
      setMode('live');
    } catch {
      setCameraError('לא הצלחנו לפתוח את המצלמה. אפשר לאשר גישה למצלמה בהגדרות הדפדפן, או לצלם / לבחור תמונה מהגלריה.');
      return;
    }
    if (!landmarkerRef.current) {
      setTrackerStatus('loading');
      try {
        landmarkerRef.current = await loadFaceLandmarker();
        setTrackerStatus('ready');
      } catch {
        setTrackerStatus('failed');
      }
    }
  };

  const exitLive = () => {
    stopCamera();
    setMode(photo ? 'photo' : 'intro');
  };

  useEffect(() => {
    if (mode === 'live' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [mode]);

  // ---- לולאת המעקב החי: מזהים את הפנים בכל פריים ומלבישים את המשקפיים ----
  useEffect(() => {
    if (mode !== 'live' || trackerStatus !== 'ready') return;
    const landmarker = landmarkerRef.current!;
    const video = videoRef.current;
    if (!video) return;
    let stopped = false;
    let handle = 0;
    let lastVideoTime = -1;
    let found = false;
    let filter = new PoseFilter();

    // requestVideoFrameCallback רץ ברגע שמגיע פריים חדש מהמצלמה – פחות השהיה מ-requestAnimationFrame
    const hasVfc = 'requestVideoFrameCallback' in video;
    const schedule = () => {
      handle = hasVfc ? video.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
    };

    const setFound = (value: boolean) => {
      if (found !== value) {
        found = value;
        setFaceFound(value);
      }
    };

    const hide = () => {
      for (const el of [liveGlassesRef.current, templeLeftRef.current, templeRightRef.current]) {
        if (el) el.style.opacity = '0';
      }
    };

    const tick = () => {
      if (stopped) return;
      schedule();
      const stage = liveStageRef.current;
      if (!stage || video.readyState < 2 || video.currentTime === lastVideoTime) return;
      lastVideoTime = video.currentTime;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const now = performance.now();
      const lm = landmarker.detectForVideo(video, now).faceLandmarks[0];
      if (!lm) {
        setFound(false);
        poseRef.current = null;
        filter = new PoseFilter();
        hide();
        return;
      }
      setFound(true);

      const raw = poseFromLandmarks(lm, vw, vh, true);
      raw.yaw = clamp(raw.yaw, -MAX_YAW, MAX_YAW);
      raw.pitch = clamp(raw.pitch * 0.5, -MAX_PITCH, MAX_PITCH);
      const pose = filter.apply(raw, vw, now);
      poseRef.current = pose;

      const glasses = liveGlassesRef.current;
      const frame = selectedRef.current;
      if (!glasses || !frame) return;

      // מיפוי מפיקסלים של הווידאו לתצוגה (object-cover)
      const cw = stage.clientWidth;
      const ch = stage.clientHeight;
      const scale = Math.max(cw / vw, ch / vh);
      const offX = (cw - vw * scale) / 2;
      const offY = (ch - vh * scale) / 2;
      const toScreen = (p: Point) => ({ x: p.x * scale + offX, y: p.y * scale + offY });
      const center = toScreen(pose);
      const width = pose.frameWidth * scale * (liveSizeRef.current / 100);

      glasses.style.left = `${center.x}px`;
      glasses.style.top = `${center.y}px`;
      glasses.style.width = `${width}px`;
      glasses.style.transform =
        `translate(-50%, -50%) perspective(${Math.round(width * 3)}px) ` +
        `rotate(${toDeg(pose.roll)}deg) rotateY(${toDeg(pose.yaw)}deg) rotateX(${toDeg(pose.pitch)}deg)`;
      glasses.style.opacity = '1';

      // ידיות: מהציר של המסגרת ועד האוזן; הצד שמסתובב הרחק מהמצלמה מוסתר
      const hinges = hingePoints(center, width, frame, pose.roll, pose.yaw, pose.pitch);
      const temples: [SVGLineElement | null, Point, Point, boolean][] = [
        [templeLeftRef.current, hinges.left, toScreen(pose.earLeft), pose.yaw > -HIDE_TEMPLE_YAW],
        [templeRightRef.current, hinges.right, toScreen(pose.earRight), pose.yaw < HIDE_TEMPLE_YAW],
      ];
      for (const [line, from, to, visible] of temples) {
        if (!line) continue;
        line.setAttribute('x1', `${from.x}`);
        line.setAttribute('y1', `${from.y}`);
        line.setAttribute('x2', `${to.x}`);
        line.setAttribute('y2', `${to.y}`);
        line.style.stroke = frame.templeColor;
        line.style.strokeWidth = `${Math.max(2, width * TEMPLE_THICKNESS)}px`;
        line.style.opacity = visible ? '1' : '0';
      }
    };

    schedule();
    return () => {
      stopped = true;
      if (hasVfc) video.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
    };
  }, [mode, trackerStatus]);

  // ---- צילום מתוך המדידה החיה: עוברים לתמונה עם המשקפיים באותו מיקום ----
  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    // חותכים ליחס התצוגה, ומשקפים כמו מראה
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const stage = liveStageRef.current;
    const aspect = stage && stage.clientHeight ? stage.clientWidth / stage.clientHeight : 3 / 4;
    let cw = vw;
    let ch = vh;
    if (vw / vh > aspect) cw = vh * aspect;
    else ch = vw / aspect;
    const sx = (vw - cw) / 2;
    const sy = (vh - ch) / 2;
    const scale = Math.min(1, 1080 / cw);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(cw * scale);
    canvas.height = Math.round(ch * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, cw, ch, 0, 0, canvas.width, canvas.height);

    const pose = poseRef.current;
    const pct = (p: Point) => ({ x: ((p.x - sx) / cw) * 100, y: ((p.y - sy) / ch) * 100 });
    setPlacement(
      pose
        ? {
            x: clamp(pct(pose).x, 0, 100),
            y: clamp(pct(pose).y, 0, 100),
            width: clamp(((pose.frameWidth * (liveSize / 100)) / cw) * 100, MIN_WIDTH, MAX_WIDTH),
            rotation: clamp(toDeg(pose.roll), -30, 30),
            ears: {
              left: pose.yaw > -HIDE_TEMPLE_YAW ? pct(pose.earLeft) : null,
              right: pose.yaw < HIDE_TEMPLE_YAW ? pct(pose.earRight) : null,
            },
          }
        : DEFAULT_PLACEMENT,
    );
    setPhotoSize({ w: canvas.width, h: canvas.height });
    setPhoto(canvas.toDataURL('image/jpeg', 0.92));
    stopCamera();
    setMode('photo');
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      const scale = Math.min(1, MAX_PHOTO_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      setPhotoSize({ w: canvas.width, h: canvas.height });
      setPhoto(canvas.toDataURL('image/jpeg', 0.92));
      stopCamera();
      setCameraError(null);
      setPlacement(DEFAULT_PLACEMENT);
      setMode('photo');
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const chooseFrame = (frame: TryOnFrame) => {
    // במדידה חיה תמיד מציגים מסגרת; על תמונה לחיצה חוזרת מסירה אותה
    setSelected((cur) => (cur?.id === frame.id && mode === 'photo' ? null : frame));
  };

  // ---- גרירה באצבע אחת, הגדלה וסיבוב בשתי אצבעות ----
  const resetGesture = () => {
    const pts = [...pointers.current.values()];
    if (pts.length === 0) {
      gesture.current = null;
      return;
    }
    const [a, b] = pts;
    gesture.current = {
      placement: placementRef.current,
      center: b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a,
      dist: b ? Math.hypot(b.x - a.x, b.y - a.y) : 0,
      angle: b ? Math.atan2(b.y - a.y, b.x - a.x) : 0,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!selected || pointers.current.size >= 2) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    resetGesture();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current || !stageRef.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const rect = stageRef.current.getBoundingClientRect();
    const g = gesture.current;
    const [a, b] = [...pointers.current.values()];
    const center = b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a;
    const next: Placement = {
      ...g.placement,
      x: clamp(g.placement.x + ((center.x - g.center.x) / rect.width) * 100, 0, 100),
      y: clamp(g.placement.y + ((center.y - g.center.y) / rect.height) * 100, 0, 100),
    };
    if (b && g.dist > 0) {
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      next.width = clamp(g.placement.width * (dist / g.dist), MIN_WIDTH, MAX_WIDTH);
      next.rotation = clamp(g.placement.rotation + toDeg(angle - g.angle), -30, 30);
    }
    setPlacement(next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    resetGesture();
  };

  // ---- שמירה / שיתוף של התמונה עם המשקפיים ----
  const saveImage = async () => {
    if (!photo || !selected) return;
    setSaving(true);
    try {
      const [base, glasses] = await Promise.all([loadImage(photo), loadImage(selected.image)]);
      const W = base.naturalWidth;
      const H = base.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(base, 0, 0);

      const gw = (placement.width / 100) * W;
      const gh = gw * (glasses.naturalHeight / glasses.naturalWidth);
      ctx.strokeStyle = selected.templeColor;
      ctx.lineWidth = Math.max(2, gw * TEMPLE_THICKNESS);
      ctx.lineCap = 'round';
      for (const t of photoTemples(placement, selected, W, H)) {
        ctx.beginPath();
        ctx.moveTo(t.from.x, t.from.y);
        ctx.lineTo(t.to.x, t.to.y);
        ctx.stroke();
      }
      ctx.save();
      ctx.translate((placement.x / 100) * W, (placement.y / 100) * H);
      ctx.rotate((placement.rotation * Math.PI) / 180);
      ctx.drawImage(glasses, -gw / 2, -gh / 2, gw, gh);
      ctx.restore();

      const fontSize = Math.round(W * 0.035);
      ctx.font = `700 ${fontSize}px Assistant, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(0, H - fontSize * 2, W, fontSize * 2);
      ctx.fillStyle = '#fff';
      ctx.fillText(`${selected.name} · ${selected.price} ₪ · האופטיקה הטובה, אמירים`, W / 2, H - fontSize * 0.7);

      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.92));
      if (!blob) return;
      const file = new File([blob], `optica-tryon-${selected.id}.jpg`, { type: 'image/jpeg' });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'איך זה נראה עליי?' });
          return;
        } catch (err) {
          if ((err as DOMException)?.name === 'AbortError') return;
        }
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    } finally {
      setSaving(false);
    }
  };

  const hiddenInputs = (
    <>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <input ref={selfieInputRef} type="file" accept="image/*" capture="user" onChange={handleFile} className="hidden" />
    </>
  );

  const frameStrip = (
    <aside className="w-[84px] sm:w-44 shrink-0 max-h-[68vh] overflow-y-auto no-scrollbar space-y-2">
      {frames.map((frame) => {
        const active = selected?.id === frame.id;
        return (
          <button
            key={frame.id}
            onClick={() => chooseFrame(frame)}
            className={`w-full rounded-2xl border-2 bg-white p-1.5 sm:p-2 text-center transition-all cursor-pointer ${
              active ? 'border-[#0047AB] ring-2 ring-blue-200' : 'border-gray-100 hover:border-blue-200'
            }`}
          >
            <div className="aspect-[8/3] flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl">
              <img src={frame.image} alt={frame.name} className="max-w-[90%] max-h-[85%]" draggable={false} />
            </div>
            <div className="mt-1 text-[11px] sm:text-xs font-bold text-gray-800 leading-tight">{frame.name}</div>
            <div className="text-[10px] sm:text-[11px] text-gray-500">
              <span className="hidden sm:inline">{frame.style} · </span>
              {frame.price} ₪
            </div>
          </button>
        );
      })}
    </aside>
  );

  const liveHint =
    trackerStatus === 'loading'
      ? 'טוען זיהוי פנים...'
      : trackerStatus === 'failed'
        ? 'המדידה החיה לא נתמכת במכשיר הזה – צלמו ומקמו את המשקפיים ידנית'
        : !faceFound
          ? 'הסתכלו למצלמה, פנים מוארות'
          : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <button
            onClick={onBackToMain}
            className="flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-[#0047AB] cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>לאתר</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg text-[#0047AB] font-['Rubik']">מדידת משקפיים</span>
            <img src={logoImg} alt="האופטיקה הטובה" className="w-9 h-9 rounded-lg border border-emerald-200" />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 sm:py-8">
        {hiddenInputs}

        {/* פתיחה */}
        {mode === 'intro' && (
          <div className="max-w-md mx-auto text-center space-y-6 pt-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#E8F0FE] flex items-center justify-center">
              <Glasses className="w-10 h-10 text-[#0047AB]" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black font-['Rubik'] text-[#1A1A1A]">איך זה נראה עליי?</h1>
              <p className="text-gray-600">
                מדידה חיה במצלמה: המשקפיים מופיעים לכם על הפנים וזזים איתכם – סובבו את הראש וראו מכל זווית.
              </p>
            </div>

            <ol className="text-right bg-white rounded-2xl border border-gray-100 p-4 space-y-2 text-sm text-gray-700 shadow-2xs">
              <li><b className="text-[#0047AB]">1.</b> פתחו מצלמה והסתכלו אליה, פנים ישרות ומוארות</li>
              <li><b className="text-[#0047AB]">2.</b> לחצו על מסגרת מהרשימה שבצד – היא תופיע עליכם</li>
              <li><b className="text-[#0047AB]">3.</b> זוזו וסובבו את הראש, ואהבתם? צלמו ושתפו</li>
            </ol>

            <div className="space-y-3">
              <button
                onClick={startLive}
                className="w-full bg-[#0047AB] hover:bg-[#003580] text-white font-black text-lg py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Video className="w-6 h-6" />
                <span>מדידה חיה במצלמה</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white border border-gray-200 text-gray-800 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-5 h-5 text-[#0047AB]" />
                <span>בחירת תמונה מהגלריה</span>
              </button>
            </div>

            {cameraError && (
              <div className="text-sm bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 space-y-2">
                <p>{cameraError}</p>
                <button
                  onClick={() => selfieInputRef.current?.click()}
                  className="font-black underline cursor-pointer"
                >
                  צילום עם מצלמת המכשיר
                </button>
              </div>
            )}

            <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>הווידאו והתמונות נשארים במכשיר שלכם בלבד ולא נשלחים לשום מקום</span>
            </p>
          </div>
        )}

        {/* מדידה חיה */}
        {mode === 'live' && (
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="flex-1 min-w-0 flex justify-center">
                <div
                  ref={liveStageRef}
                  className="relative aspect-[3/4] w-full max-w-md max-h-[68vh] rounded-3xl overflow-hidden bg-black shadow-lg"
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover -scale-x-100"
                  />
                  {selected && trackerStatus === 'ready' && (
                    <>
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <line ref={templeLeftRef} strokeLinecap="round" opacity={0} />
                        <line ref={templeRightRef} strokeLinecap="round" opacity={0} />
                      </svg>
                      <img
                        ref={liveGlassesRef}
                        src={selected.image}
                        alt={selected.name}
                        draggable={false}
                        className="absolute top-0 left-0 opacity-0 pointer-events-none will-change-transform"
                      />
                    </>
                  )}
                  {trackerStatus !== 'ready' && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-[62%] h-[62%] -mt-[8%] rounded-[50%] border-4 border-white/70 border-dashed" />
                    </div>
                  )}
                  {liveHint && (
                    <div className="absolute top-3 inset-x-3 flex justify-center pointer-events-none">
                      <span className="flex items-center gap-1.5 bg-black/55 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full text-center">
                        {trackerStatus === 'loading' ? (
                          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                        ) : (
                          <ScanFace className="w-4 h-4 shrink-0" />
                        )}
                        <span>{liveHint}</span>
                      </span>
                    </div>
                  )}
                  {selected && (
                    <div className="absolute bottom-2 right-2 bg-white/90 rounded-full px-3 py-1 text-xs font-black text-[#0047AB] shadow">
                      {selected.name} · {selected.price} ₪
                    </div>
                  )}
                  <button
                    onClick={exitLive}
                    aria-label="סגירת מצלמה"
                    className="absolute top-3 left-3 bg-black/40 text-white p-2 rounded-full cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {frameStrip}
            </div>

            {trackerStatus === 'ready' && (
              <label className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs">
                <span className="w-14 shrink-0">גודל</span>
                <input
                  type="range"
                  min={80}
                  max={125}
                  value={liveSize}
                  onChange={(e) => setLiveSize(Number(e.target.value))}
                  className="flex-1 accent-[#0047AB]"
                />
              </label>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={capture}
                aria-label="צילום"
                className="w-20 h-20 rounded-full bg-white border-[6px] border-[#0047AB] shadow-lg active:scale-95 transition-transform cursor-pointer flex items-center justify-center"
              >
                <Camera className="w-8 h-8 text-[#0047AB]" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-500">צלמו כדי לשמור, לשתף ולהשוות מסגרות על אותה תמונה</p>

            <button
              onClick={() => {
                stopCamera();
                onBookAppointment();
              }}
              className="w-full bg-[#0047AB] hover:bg-[#003580] text-white font-black py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              <span>אהבתי! קביעת תור למדידה בחנות</span>
            </button>
          </div>
        )}

        {/* תמונה: התאמה ידנית, שמירה ושיתוף */}
        {mode === 'photo' && photo && (
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="flex-1 min-w-0 flex justify-center">
                <div
                  ref={stageRef}
                  className="relative inline-block rounded-3xl overflow-hidden shadow-lg bg-black select-none touch-none"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  <img
                    src={photo}
                    alt="התמונה שלך"
                    draggable={false}
                    className="block max-w-full max-h-[68vh] w-auto h-auto"
                  />
                  {selected && !comparing && (
                    <svg
                      viewBox={`0 0 ${photoSize.w} ${photoSize.h}`}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                      {photoTemples(placement, selected, photoSize.w, photoSize.h).map((t, i) => (
                        <line
                          key={i}
                          x1={t.from.x}
                          y1={t.from.y}
                          x2={t.to.x}
                          y2={t.to.y}
                          stroke={selected.templeColor}
                          strokeWidth={Math.max(2, (placement.width / 100) * photoSize.w * TEMPLE_THICKNESS)}
                          strokeLinecap="round"
                        />
                      ))}
                    </svg>
                  )}
                  {selected && !comparing && (
                    <img
                      src={selected.image}
                      alt={selected.name}
                      draggable={false}
                      className="absolute pointer-events-none drop-shadow-md"
                      style={{
                        left: `${placement.x}%`,
                        top: `${placement.y}%`,
                        width: `${placement.width}%`,
                        transform: `translate(-50%, -50%) rotate(${placement.rotation}deg)`,
                      }}
                    />
                  )}
                  {selected && (
                    <div className="absolute bottom-2 right-2 bg-white/90 rounded-full px-3 py-1 text-xs font-black text-[#0047AB] shadow">
                      {selected.name} · {selected.price} ₪
                    </div>
                  )}
                  {!selected && (
                    <div className="absolute inset-x-0 bottom-3 text-center text-white text-sm font-bold drop-shadow">
                      ← בחרו מסגרת מהרשימה
                    </div>
                  )}
                </div>
              </div>
              {frameStrip}
            </div>

            {/* כיוונון */}
            {selected && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 shadow-2xs">
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Move className="w-4 h-4 text-[#0047AB]" />
                  <span>גררו את המשקפיים באצבע, צבטו בשתי אצבעות כדי להגדיל ולסובב</span>
                </p>
                <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <span className="w-14 shrink-0">גודל</span>
                  <input
                    type="range"
                    min={MIN_WIDTH}
                    max={MAX_WIDTH}
                    value={placement.width}
                    onChange={(e) => setPlacement({ ...placement, width: Number(e.target.value) })}
                    className="flex-1 accent-[#0047AB]"
                  />
                </label>
                <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <span className="w-14 shrink-0">הטיה</span>
                  <input
                    type="range"
                    min={-30}
                    max={30}
                    value={placement.rotation}
                    onChange={(e) => setPlacement({ ...placement, rotation: Number(e.target.value) })}
                    className="flex-1 accent-[#0047AB]"
                  />
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onPointerDown={() => setComparing(true)}
                    onPointerUp={() => setComparing(false)}
                    onPointerLeave={() => setComparing(false)}
                    onContextMenu={(e) => e.preventDefault()}
                    className="flex-1 min-w-[130px] bg-slate-100 text-gray-800 font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-1.5 select-none cursor-pointer"
                  >
                    {comparing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>החזיקו להשוואה</span>
                  </button>
                  <button
                    onClick={() => setPlacement(DEFAULT_PLACEMENT)}
                    className="flex-1 min-w-[130px] bg-slate-100 text-gray-800 font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>איפוס מיקום</span>
                  </button>
                </div>
              </div>
            )}

            {/* פעולות */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={startLive}
                className="bg-white border border-gray-200 text-gray-800 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#0047AB]" />
                <span>חזרה למדידה חיה</span>
              </button>
              <button
                onClick={saveImage}
                disabled={!selected || saving}
                className="bg-white border border-gray-200 text-gray-800 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#0047AB]" />
                <span>{saving ? 'שומר...' : 'שמירה / שיתוף'}</span>
              </button>
              <button
                onClick={onBookAppointment}
                className="col-span-2 bg-[#0047AB] hover:bg-[#003580] text-white font-black py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>אהבתי! קביעת תור למדידה בחנות</span>
              </button>
            </div>

            <p className="text-center text-xs text-gray-400">
              ההדמיה להמחשה בלבד – המסגרות האמיתיות מחכות לכם בחנות במצפה מנחם 86, אמירים
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
