import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Lock, Upload, Trash2, Loader2, Glasses, AlertTriangle, CheckCircle2, LogOut, ImagePlus,
} from 'lucide-react';
import { fetchFrames, loginAdmin, addFrame, deleteFrame, UploadedFrame } from '../utils/framesApi';
import { processFrameImage, ProcessedFrame } from '../utils/frameImage';
import logoImg from '../assets/images/logo_optics.svg';

interface SettingsPageProps {
  onBackToMain: () => void;
  onOpenTryOn: () => void;
}

const PASSWORD_KEY = 'optica-admin-password';
const PRICES = [150, 200, 250, 300];
const CHECKERBOARD =
  'repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 16px 16px';

const readSession = () => {
  try {
    return sessionStorage.getItem(PASSWORD_KEY) || '';
  } catch {
    return '';
  }
};

const writeSession = (value: string | null) => {
  try {
    if (value) sessionStorage.setItem(PASSWORD_KEY, value);
    else sessionStorage.removeItem(PASSWORD_KEY);
  } catch {
    // אחסון לא זמין (גלישה בסתר) – פשוט נבקש סיסמה שוב בפעם הבאה
  }
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBackToMain, onOpenTryOn }) => {
  const [password, setPassword] = useState(readSession);
  const [loggedIn, setLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const [configured, setConfigured] = useState(true);
  const [frames, setFrames] = useState<UploadedFrame[]>([]);
  const [listError, setListError] = useState<string | null>(null);

  const [source, setSource] = useState<HTMLImageElement | null>(null);
  const [tolerance, setTolerance] = useState(35);
  const [removeInside, setRemoveInside] = useState(true);
  const [processed, setProcessed] = useState<ProcessedFrame | null>(null);
  const [hingeY, setHingeY] = useState(45);
  const [templeColor, setTempleColor] = useState('#222222');
  const [name, setName] = useState('');
  const [style, setStyle] = useState('');
  const [price, setPrice] = useState(150);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshFrames = async () => {
    try {
      const res = await fetchFrames();
      setFrames(res.frames);
      setConfigured(res.configured);
      setListError(null);
    } catch (err) {
      setListError((err as Error).message);
    }
  };

  const tryLogin = async (pw: string) => {
    setChecking(true);
    setLoginError(null);
    try {
      const res = await loginAdmin(pw);
      setPassword(pw);
      writeSession(pw);
      setLoggedIn(true);
      setConfigured(res.configured);
      refreshFrames();
    } catch (err) {
      writeSession(null);
      setLoginError((err as Error).message);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (password) tryLogin(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // עיבוד מחדש בכל שינוי של התמונה או של הגדרות הסרת הרקע
  useEffect(() => {
    if (!source) return;
    const result = processFrameImage(source, { tolerance, removeInside });
    setProcessed(result);
    if (result) {
      setHingeY(result.hingeY);
      setTempleColor(result.templeColor);
    }
  }, [source, tolerance, removeInside]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setMessage(null);
    const url = URL.createObjectURL(file);
    try {
      setSource(await loadImage(url));
    } catch {
      setMessage({ ok: false, text: 'לא הצלחנו לקרוא את התמונה' });
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const resetForm = () => {
    setSource(null);
    setProcessed(null);
    setName('');
    setStyle('');
  };

  const save = async () => {
    if (!processed || !name.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      await addFrame(password, {
        name: name.trim(),
        style: style.trim(),
        price,
        aspect: processed.width / processed.height,
        hingeY,
        templeColor,
        imageData: processed.dataUrl,
      });
      setMessage({ ok: true, text: `המסגרת "${name.trim()}" נשמרה ומופיעה בדף המדידה` });
      resetForm();
      refreshFrames();
    } catch (err) {
      setMessage({ ok: false, text: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (frame: UploadedFrame) => {
    if (!window.confirm(`למחוק את המסגרת "${frame.name}"?`)) return;
    try {
      await deleteFrame(password, frame.id);
      setFrames((cur) => cur.filter((f) => f.id !== frame.id));
    } catch (err) {
      setListError((err as Error).message);
    }
  };

  const logout = () => {
    writeSession(null);
    setPassword('');
    setLoggedIn(false);
  };

  const header = (
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
          <span className="font-black text-lg text-[#0047AB] font-['Rubik']">הגדרות</span>
          <img src={logoImg} alt="האופטיקה הטובה" className="w-9 h-9 rounded-lg border border-emerald-200" />
        </div>
      </div>
    </header>
  );

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {header}
        <main className="flex-1 w-full max-w-sm mx-auto px-4 pt-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput) tryLogin(passwordInput);
            }}
            className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 space-y-4 text-center"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8F0FE] flex items-center justify-center">
              <Lock className="w-7 h-7 text-[#0047AB]" />
            </div>
            <h1 className="text-xl font-black font-['Rubik']">כניסה להגדרות</h1>
            <input
              type="password"
              autoComplete="current-password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="סיסמה"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button
              type="submit"
              disabled={checking || !passwordInput}
              className="w-full bg-[#0047AB] hover:bg-[#003580] text-white font-black py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {checking && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>כניסה</span>
            </button>
          </form>
        </main>
      </div>
    );
  }

  const hingePct = (hingeY / 120) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {header}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-black font-['Rubik'] text-[#1A1A1A]">מסגרות למדידה</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTryOn}
              className="flex items-center gap-1.5 text-sm font-bold text-[#0047AB] bg-[#E8F0FE] px-3 py-2 rounded-xl cursor-pointer"
            >
              <Glasses className="w-4 h-4" />
              <span>לדף המדידה</span>
            </button>
            <button
              onClick={logout}
              aria-label="יציאה"
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!configured && (
          <div className="flex gap-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="space-y-1">
              <p className="font-black">אחסון התמונות עוד לא מחובר</p>
              <p>
                ב-Vercel: Storage ← Create ← Blob (גישה ציבורית / Public) ← Connect לפרויקט optica-4, ואז Redeploy.
                עד אז אי אפשר לשמור מסגרות.
              </p>
            </div>
          </div>
        )}

        {/* הוספת מסגרת */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-black flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-[#0047AB]" />
            <span>הוספת מסגרת</span>
          </h2>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

          {!source && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-blue-200 hover:border-[#0047AB] rounded-2xl p-8 text-center space-y-2 cursor-pointer"
            >
              <Upload className="w-8 h-8 mx-auto text-[#0047AB]" />
              <p className="font-black text-[#0047AB]">בחירת תמונה של מסגרת</p>
              <p className="text-xs text-gray-500">
                צלמו את המשקפיים מלפנים, ישר וממורכזים, על רקע לבן או בהיר אחיד. הרקע יוסר אוטומטית.
              </p>
            </button>
          )}

          {source && (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-3">
                {processed ? (
                  <div className="rounded-2xl border border-gray-200 p-6" style={{ background: CHECKERBOARD }}>
                    <div className="relative">
                      <img src={processed.dataUrl} alt="תצוגה מקדימה" className="block w-full" />
                      {/* קו הציר + תחילת הידיות */}
                      <div
                        className="absolute inset-x-0 border-t-2 border-dashed border-rose-500 pointer-events-none"
                        style={{ top: `${hingePct}%` }}
                      />
                      <div
                        className="absolute h-1.5 w-8 rounded-full -right-8 -translate-y-1/2"
                        style={{ top: `${hingePct}%`, background: templeColor }}
                      />
                      <div
                        className="absolute h-1.5 w-8 rounded-full -left-8 -translate-y-1/2"
                        style={{ top: `${hingePct}%`, background: templeColor }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                    לא נשאר כלום אחרי הסרת הרקע – הקטינו את רגישות ההסרה.
                  </div>
                )}

                <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <span className="w-24 shrink-0">הסרת רקע</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="flex-1 accent-[#0047AB]"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={removeInside}
                    onChange={(e) => setRemoveInside(e.target.checked)}
                    className="accent-[#0047AB] w-4 h-4"
                  />
                  <span>להסיר רקע גם בתוך העדשות (לבטל במסגרות לבנות/שקופות)</span>
                </label>
                <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <span className="w-24 shrink-0">גובה הציר</span>
                  <input
                    type="range"
                    min={0}
                    max={120}
                    step={0.5}
                    value={hingeY}
                    onChange={(e) => setHingeY(Number(e.target.value))}
                    className="flex-1 accent-rose-500"
                  />
                </label>
                <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <span className="w-24 shrink-0">צבע הידיות</span>
                  <input
                    type="color"
                    value={templeColor}
                    onChange={(e) => setTempleColor(e.target.value)}
                    className="w-12 h-9 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <span className="text-xs font-normal text-gray-500">זוהה אוטומטית – אפשר לשנות</span>
                </label>
                <p className="text-xs text-gray-500">
                  הקו האדום מסמן איפה הידיות יוצאות מהמסגרת. מזיזים אותו לגובה החיבור בצדדים.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 space-y-1">
                  <span>שם המסגרת *</span>
                  <input
                    value={name}
                    maxLength={40}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="למשל: מלבני שחור מט"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="block text-sm font-bold text-gray-700 space-y-1">
                  <span>סגנון</span>
                  <input
                    value={style}
                    maxLength={30}
                    onChange={(e) => setStyle(e.target.value)}
                    placeholder="למשל: מלבני, עגול, חתולי"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <div className="text-sm font-bold text-gray-700 space-y-1">
                  <span>מחיר (₪)</span>
                  <div className="flex gap-2">
                    {PRICES.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPrice(p)}
                        className={`flex-1 py-2 rounded-xl border-2 font-black cursor-pointer ${
                          price === p ? 'border-[#0047AB] bg-[#E8F0FE] text-[#0047AB]' : 'border-gray-100 text-gray-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={save}
                    disabled={!processed || !name.trim() || saving || !configured}
                    className="flex-1 bg-[#0047AB] hover:bg-[#003580] text-white font-black py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>שמירת המסגרת</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-4 bg-slate-100 text-gray-700 font-bold rounded-xl cursor-pointer"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          )}

          {message && (
            <p
              className={`flex items-center gap-1.5 text-sm font-bold ${message.ok ? 'text-emerald-700' : 'text-red-600'}`}
            >
              {message.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{message.text}</span>
            </p>
          )}
        </section>

        {/* המסגרות שהועלו */}
        <section className="space-y-3">
          <h2 className="text-lg font-black">המסגרות שהועלו ({frames.length})</h2>
          {listError && <p className="text-sm text-red-600">{listError}</p>}
          {frames.length === 0 ? (
            <p className="text-sm text-gray-500 bg-white rounded-2xl border border-gray-100 p-4">
              עוד לא הועלו מסגרות, ולכן דף המדידה מציג את מסגרות הדוגמה. ברגע שתעלו מסגרת ראשונה, יוצגו רק המסגרות שלכם.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {frames.map((frame) => (
                <div key={frame.id} className="bg-white rounded-2xl border border-gray-100 p-3 space-y-2 shadow-2xs">
                  <div
                    className="aspect-[8/3] rounded-xl flex items-center justify-center p-2"
                    style={{ background: CHECKERBOARD }}
                  >
                    <img src={frame.image} alt={frame.name} className="max-w-full max-h-full" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-gray-800 leading-tight">{frame.name}</div>
                      <div className="text-xs text-gray-500">
                        {frame.style ? `${frame.style} · ` : ''}
                        {frame.price} ₪
                      </div>
                    </div>
                    <button
                      onClick={() => remove(frame)}
                      aria-label={`מחיקת ${frame.name}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
