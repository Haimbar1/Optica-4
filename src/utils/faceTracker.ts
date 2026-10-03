import type { FaceLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';
import wasmLoader from '@mediapipe/tasks-vision/vision_wasm_internal.js?url';
import wasmBinary from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url';
import wasmLoaderNoSimd from '@mediapipe/tasks-vision/vision_wasm_nosimd_internal.js?url';
import wasmBinaryNoSimd from '@mediapipe/tasks-vision/vision_wasm_nosimd_internal.wasm?url';

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

// נקודות ציון של MediaPipe Face Mesh
const RIGHT_EYE_OUTER = 33;
const LEFT_EYE_OUTER = 263;
const FOREHEAD = 10;
const CHIN = 152;
// קצה הפנים בגובה החלק העליון של האוזן (שם הידית נשענת): בין גובה העין לגבה
const RIGHT_EAR = [127, 162];
const LEFT_EAR = [356, 389];

// גובה הציר של מסגרת נמדד ביחידות של 0–120 מגובה התמונה (כמו ב-viewBox של
// מסגרות הדוגמה, 320x120). יחס ברירת המחדל הוא של מסגרות הדוגמה.
const HINGE_SCALE = 120;
export const DEFAULT_FRAME_ASPECT = 320 / 120;

// רוחב תמונת המשקפיים ביחס לרוחב הפנים בגובה הרקות
const FACE_TO_FRAME_WIDTH = 1.0;
// כמה להרחיק את נקודת האוזן מקצה הפנים החוצה, ביחס לרוחב הפנים
const EAR_OUTSET = 0.07;

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

// טעינה עצלה – הספרייה והמודל (~15MB) נטענים רק כשנכנסים למדידה החיה
export function loadFaceLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
      const simd = await FilesetResolver.isSimdSupported();
      const fileset = simd
        ? { wasmLoaderPath: wasmLoader, wasmBinaryPath: wasmBinary }
        : { wasmLoaderPath: wasmLoaderNoSimd, wasmBinaryPath: wasmBinaryNoSimd };
      const create = (delegate: 'GPU' | 'CPU') =>
        FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate },
          runningMode: 'VIDEO',
          numFaces: 1,
        });
      try {
        return await create('GPU');
      } catch {
        return await create('CPU');
      }
    })();
    landmarkerPromise.catch(() => {
      landmarkerPromise = null;
    });
  }
  return landmarkerPromise;
}

export interface Point {
  x: number;
  y: number;
}

// תנוחת הפנים בפיקסלים של המקור (אחרי שיקוף אם מבקשים). זוויות ברדיאנים,
// בכיווני CSS: roll עם כיוון השעון, yaw חיובי = הצד הימני במסך מתרחק,
// pitch חיובי = הסנטר מתקרב למצלמה.
export interface FacePose {
  x: number;
  y: number;
  // רוחב המשקפיים המתאים לפנים
  frameWidth: number;
  roll: number;
  yaw: number;
  pitch: number;
  // נקודות האוזניים לפי צד המסך (אחרי שיקוף)
  earLeft: Point;
  earRight: Point;
}

export function poseFromLandmarks(
  lm: NormalizedLandmark[],
  width: number,
  height: number,
  mirror: boolean,
): FacePose {
  // z של MediaPipe באותו קנה מידה כמו x; ערך גדול יותר = רחוק יותר מהמצלמה
  const p = (i: number) => ({
    x: (mirror ? 1 - lm[i].x : lm[i].x) * width,
    y: lm[i].y * height,
    z: lm[i].z * width,
  });
  const r = p(RIGHT_EYE_OUTER);
  const l = p(LEFT_EYE_OUTER);
  // במראה העין הימנית של האדם מופיעה בצד ימין של המסך
  const [screenLeft, screenRight] = mirror ? [l, r] : [r, l];
  const v = {
    x: screenRight.x - screenLeft.x,
    y: screenRight.y - screenLeft.y,
    z: screenRight.z - screenLeft.z,
  };
  const flat = Math.hypot(v.x, v.y);

  const avg = (ids: number[]) => {
    const pts = ids.map(p);
    const mean = (k: 'x' | 'y' | 'z') => pts.reduce((sum, q) => sum + q[k], 0) / pts.length;
    return { x: mean('x'), y: mean('y'), z: mean('z') };
  };
  const [edgeLeft, edgeRight] = mirror ? [avg(LEFT_EAR), avg(RIGHT_EAR)] : [avg(RIGHT_EAR), avg(LEFT_EAR)];
  const faceSpan = Math.hypot(edgeRight.x - edgeLeft.x, edgeRight.y - edgeLeft.y, edgeRight.z - edgeLeft.z);
  // האוזן יושבת מעט מחוץ לקו קצה הפנים, בכיוון קו העיניים
  const ux = v.x / flat;
  const uy = v.y / flat;
  const out = faceSpan * EAR_OUTSET;
  const earLeft = { x: edgeLeft.x - ux * out, y: edgeLeft.y - uy * out };
  const earRight = { x: edgeRight.x + ux * out, y: edgeRight.y + uy * out };

  const top = p(FOREHEAD);
  const bottom = p(CHIN);
  const w = { x: bottom.x - top.x, y: bottom.y - top.y, z: bottom.z - top.z };

  return {
    x: (r.x + l.x) / 2,
    y: (r.y + l.y) / 2,
    frameWidth: faceSpan * FACE_TO_FRAME_WIDTH,
    roll: Math.atan2(v.y, v.x),
    yaw: Math.atan2(v.z, flat),
    pitch: Math.atan2(-w.z, Math.hypot(w.x, w.y)),
    earLeft,
    earRight,
  };
}

// מסנן One Euro: כמעט בלי החלקה בתנועה מהירה (בלי השהיה), והרבה החלקה
// כשהראש עומד (בלי רעידות). https://gery.casiez.net/1euro/
class OneEuroFilter {
  private value: number | null = null;
  private deriv = 0;
  private lastT = 0;

  constructor(private minCutoff: number, private beta: number, private dCutoff = 1) {}

  private static alpha(cutoff: number, dt: number) {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / dt);
  }

  filter(x: number, tMs: number): number {
    if (this.value === null) {
      this.value = x;
      this.lastT = tMs;
      return x;
    }
    const dt = Math.max(0.001, (tMs - this.lastT) / 1000);
    this.lastT = tMs;
    const rawDeriv = (x - this.value) / dt;
    this.deriv += OneEuroFilter.alpha(this.dCutoff, dt) * (rawDeriv - this.deriv);
    const cutoff = this.minCutoff + this.beta * Math.abs(this.deriv);
    this.value += OneEuroFilter.alpha(cutoff, dt) * (x - this.value);
    return this.value;
  }
}

// מחליק את תנוחת הפנים. מיקומים מנורמלים לרוחב הווידאו כדי שהכיול
// לא יהיה תלוי ברזולוציית המצלמה.
export class PoseFilter {
  private pos = () => new OneEuroFilter(1.2, 15);
  private ang = () => new OneEuroFilter(1.2, 8);
  private f = {
    x: this.pos(), y: this.pos(), span: new OneEuroFilter(0.8, 5),
    roll: this.ang(), yaw: this.ang(), pitch: this.ang(),
    elx: this.pos(), ely: this.pos(), erx: this.pos(), ery: this.pos(),
  };

  apply(pose: FacePose, frameWidth: number, tMs: number): FacePose {
    const n = (key: keyof PoseFilter['f'], v: number) => this.f[key].filter(v / frameWidth, tMs) * frameWidth;
    const a = (key: keyof PoseFilter['f'], v: number) => this.f[key].filter(v, tMs);
    return {
      x: n('x', pose.x),
      y: n('y', pose.y),
      frameWidth: n('span', pose.frameWidth),
      roll: a('roll', pose.roll),
      yaw: a('yaw', pose.yaw),
      pitch: a('pitch', pose.pitch),
      earLeft: { x: n('elx', pose.earLeft.x), y: n('ely', pose.earLeft.y) },
      earRight: { x: n('erx', pose.earRight.x), y: n('ery', pose.earRight.y) },
    };
  }
}

// מיקום הצירים (חיבור הידית למסגרת) על המסך, באותה טרנספורמציה של CSS
// שמשמשת לציור המשקפיים: rotate(roll) rotateY(yaw) rotateX(pitch) עם perspective.
export function hingePoints(
  center: Point,
  width: number,
  frame: { hingeY: number; aspect?: number },
  roll: number,
  yaw = 0,
  pitch = 0,
): { left: Point; right: Point } {
  const height = width / (frame.aspect ?? DEFAULT_FRAME_ASPECT);
  const d = width * 3;
  const project = (lx: number, ly: number): Point => {
    // rotateX
    let y = ly * Math.cos(pitch);
    let z = ly * Math.sin(pitch);
    // rotateY
    const x = lx * Math.cos(yaw) + z * Math.sin(yaw);
    z = -lx * Math.sin(yaw) + z * Math.cos(yaw);
    // rotateZ
    const rx = x * Math.cos(roll) - y * Math.sin(roll);
    y = x * Math.sin(roll) + y * Math.cos(roll);
    const k = yaw || pitch ? d / (d - z) : 1;
    return { x: center.x + rx * k, y: center.y + y * k };
  };
  const ly = (frame.hingeY / HINGE_SCALE - 0.5) * height;
  return { left: project(-width / 2, ly), right: project(width / 2, ly) };
}

