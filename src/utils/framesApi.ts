import type { TryOnFrame } from '../data/tryOnFrames';

// מסגרות שהעסק העלה בפורטל (portal.smartesek.com ← אתר) – מוצגות בדף המדידה במקום מסגרות הדוגמה
export interface UploadedFrame extends TryOnFrame {
  aspect: number;
}

export async function fetchFrames(): Promise<{ frames: UploadedFrame[] }> {
  const res = await fetch('/api/frames');
  if (!res.ok) throw new Error(`שגיאה ${res.status}`);
  return res.json();
}
