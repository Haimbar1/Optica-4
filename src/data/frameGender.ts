import type { TryOnFrame } from './tryOnFrames';

export type FrameGender = 'women' | 'men' | 'unisex';

// סיווג המסגרות שהועלו לפורטל לנשים / גברים / יוניסקס, לפי המראה של המסגרת
// (צבעים, קאט-איי ועדינות → נשים; מלבני כהה, גשר כפול ומתכת מרובעת → גברים).
// מסגרת חדשה שלא מופיעה כאן נחשבת יוניסקס ומוצגת בשני הסינונים.
// אם בעתיד יגיע מהפורטל שדה gender, או שהמילה "נשים"/"גברים" מופיעה בסגנון או בתיאור – הוא קובע.
const FRAME_GENDER: Record<string, FrameGender> = {
  mvvfpulcefa321b2: 'women', // מסגרת 16
  mvvfpwiv8882e9e9: 'women', // מסגרת 18
  mvvfpxigc98a2d63: 'women', // מסגרת 19
  mvvfpyk81d359a71: 'women', // מסגרת 20
  mvvfpzgy4efa5da2: 'men', // מסגרת 21
  mvvfq0eb5026a0da: 'women', // מסגרת 22
  mvvfq1dqa4a36d15: 'unisex', // מסגרת 23
  mvvfq2d755a1488b: 'women', // מסגרת 24
  mwe0o4dk1a4f2f96: 'unisex', // מסגרת 24
  mwe0o5j60c06dc3c: 'women', // מסגרת 25
  mwe0o6fh8264b206: 'women', // מסגרת 26
  mwe0o7edfe6b0c31: 'unisex', // מסגרת 27
  mwe0o89occf5ec1d: 'unisex', // מסגרת 28
  mwe0ps0o34e7fb16: 'women', // מסגרת 29
  mwe0pt5t37af83cc: 'unisex', // מסגרת 30
  mwe0pu322424f80f: 'unisex', // מסגרת 31
  mwe0pv2xc720829c: 'unisex', // מסגרת 32
  mwe0pw2m919fba2e: 'men', // מסגרת 34
  mwe0pwup7fb92311: 'men', // מסגרת 35
  mwe0s39aa1afc5f4: 'women', // מסגרת 35
  mwe0s4lf95789c26: 'unisex', // מסגרת 37
  mwe0s5n37f4fd7ef: 'women', // מסגרת 38
  mwe0s6nf70908324: 'women', // מסגרת 39
  mwe0s7lr0b65aa67: 'men', // מסגרת 40
  mwe0s8ke53f54f7e: 'women', // מסגרת 41
  mwe0s9mtbc67d720: 'unisex', // מסגרת 42
  mwe0sapab2a3d36c: 'women', // מסגרת 43
  mwe0vtl5ca6f4a7a: 'women', // מסגרת 45
  mwe0vuyle5aca94c: 'men', // מסגרת 46
  mwe0vvzs31103612: 'women', // מסגרת 47
  mwe0vx0h765f56b5: 'men', // מסגרת 48
  mwe0vy167214438e: 'unisex', // מסגרת 49
  mwe0vz2wa54c386a: 'unisex', // מסגרת 50
  mwe0w00g078d4f33: 'men', // מסגרת 51
  mwe0w12hbba1fb2b: 'women', // מסגרת 53
  mwe0w22xffbf2afd: 'women', // מסגרת 54
  mwe0w35oc42737ac: 'unisex', // מסגרת 55
  mwe0ye71b7f47e49: 'unisex', // מסגרת 53
  mwe0yf9h2a29f2fa: 'unisex', // מסגרת 54
  mwe0ygc6d62aed53: 'women', // מסגרת 55
  mwe0yhbw8b008885: 'men', // מסגרת 56
  mwe0yi9g851ca149: 'women', // מסגרת 57
  mwe0yja29176c968: 'unisex', // מסגרת 58
  mwe0yk7r774b96a1: 'unisex', // מסגרת 59
  mwe0ylaadad40607: 'unisex', // מסגרת 60
  mwe0ymap4d277bcf: 'men', // מסגרת 61
  mwe0yne2b069705a: 'women', // מסגרת 62
  mwe0yo9ibdbe9a52: 'women', // מסגרת 63
  mwe0ypb5469348ee: 'women', // מסגרת 64
  mwe0yqdxef907f1f: 'unisex', // מסגרת 65
  mwe12d9d5ed116c8: 'men', // מסגרת 66
  mwe12ect7e3a272d: 'men', // מסגרת 67
  mwe12fb26ee36c6e: 'men', // מסגרת 68
  mwe12gck5129cfa3: 'men', // מסגרת 69
  mwe12h7328d4a4fe: 'men', // מסגרת 70
  mwe12i4ff0ea297a: 'men', // מסגרת 71
  mwe12j7743dae1e9: 'men', // מסגרת 72
  mwe12k3x9926bf12: 'men', // מסגרת 73
  mwe12l16ab30cdb3: 'men', // מסגרת 74
  mwe12lz092bab1ca: 'women', // מסגרת 75
  mwe12n1g05a0a52c: 'men', // מסגרת 76
  mwe12nzr6ec12e5c: 'unisex', // מסגרת 77
  mwe12oyk4de79eee: 'women', // מסגרת 78
  mwe12pxka12319af: 'men', // מסגרת 79
  mwe12qvz6b2310df: 'men', // מסגרת 80
  mwe12ruaf8c2ef54: 'men', // מסגרת 81
  // מסגרות הדוגמה
  'rect-black': 'men',
  'round-gold': 'unisex',
  'cateye-burgundy': 'women',
  tortoise: 'unisex',
  'browline-navy': 'men',
  'crystal-clear': 'unisex',
  'aviator-sun': 'men',
  'kids-teal': 'unisex',
};

const fromText = (text: unknown): FrameGender | null => {
  const s = String(text ?? '').toLowerCase();
  if (!s) return null;
  if (/יוניסקס|unisex/.test(s)) return 'unisex';
  if (/נשים|אישה|women|female/.test(s)) return 'women';
  if (/גברים|גבר|men|male/.test(s)) return 'men';
  return null;
};

export function frameGender(frame: TryOnFrame & { gender?: unknown; description?: string }): FrameGender {
  return (
    fromText(frame.gender) ||
    fromText(frame.style) ||
    fromText(frame.description) ||
    FRAME_GENDER[frame.id] ||
    'unisex'
  );
}

export type GenderFilter = 'all' | 'women' | 'men';

// יוניסקס מופיעה גם בנשים וגם בגברים
export const matchesGender = (frame: TryOnFrame, filter: GenderFilter) =>
  filter === 'all' || frameGender(frame) === filter || frameGender(frame) === 'unisex';
