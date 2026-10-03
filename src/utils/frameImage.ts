// עיבוד תמונת מסגרת שצולמה בחנות: הסרת רקע, חיתוך צמוד, וזיהוי אוטומטי
// של גובה הציר וצבע הידיות. הכל רץ בדפדפן.

export interface ProcessOptions {
  // 0–100: עד כמה צבע יכול להיות שונה מהרקע ועדיין להיחשב רקע
  tolerance: number;
  // true: מסיר רקע גם בתוך העדשות; false: רק מה שמחובר לשולי התמונה (למסגרות בהירות)
  removeInside: boolean;
}

export interface ProcessedFrame {
  dataUrl: string;
  width: number;
  height: number;
  hingeY: number;
  templeColor: string;
}

const OUTPUT_WIDTH = 960;

const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

// צבע הרקע = הממוצע של שולי התמונה
function borderColor(data: Uint8ClampedArray, w: number, h: number): [number, number, number] {
  let r = 0, g = 0, b = 0, n = 0;
  const add = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
  };
  for (let x = 0; x < w; x++) { add(x, 0); add(x, h - 1); }
  for (let y = 0; y < h; y++) { add(0, y); add(w - 1, y); }
  return [r / n, g / n, b / n];
}

export function processFrameImage(img: HTMLImageElement, opts: ProcessOptions): ProcessedFrame | null {
  // מקטינים מראש כדי שהעיבוד יהיה מהיר גם בטלפון
  const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // אם יש כבר שקיפות (PNG מוכן) – לא נוגעים ברקע
  let hasAlpha = false;
  for (let i = 3; i < data.length; i += 4 * 97) if (data[i] < 250) { hasAlpha = true; break; }

  if (!hasAlpha) {
    const [br, bg, bb] = borderColor(data, w, h);
    const hard = (opts.tolerance / 100) * 120 + 8;
    const soft = hard * 1.6;
    const dist = (i: number) => Math.hypot(data[i] - br, data[i + 1] - bg, data[i + 2] - bb);

    // רקע = קרוב לצבע השוליים. במצב "רק מבחוץ" – רק פיקסלים שמחוברים לשוליים
    let isBg: Uint8Array;
    if (opts.removeInside) {
      isBg = new Uint8Array(w * h).fill(1);
    } else {
      isBg = new Uint8Array(w * h);
      const stack: number[] = [];
      const push = (p: number) => {
        if (!isBg[p] && dist(p * 4) < soft) { isBg[p] = 1; stack.push(p); }
      };
      for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
      for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
      while (stack.length) {
        const p = stack.pop()!;
        const x = p % w;
        if (x > 0) push(p - 1);
        if (x < w - 1) push(p + 1);
        if (p >= w) push(p - w);
        if (p < w * (h - 1)) push(p + w);
      }
    }

    for (let p = 0; p < w * h; p++) {
      if (!isBg[p]) continue;
      const d = dist(p * 4);
      // מעבר רך בין רקע לשפת המסגרת, בלי הילה לבנה
      const alpha = d <= hard ? 0 : d >= soft ? 1 : (d - hard) / (soft - hard);
      data[p * 4 + 3] = Math.round(data[p * 4 + 3] * alpha);
    }
  }

  // חיתוך צמוד לגבולות המסגרת
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 24) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;

  // ציר: הגובה שבו המסגרת מגיעה לקצה החיצוני (העמודות החיצוניות ביותר משני הצדדים).
  // צבע הידיות: ממוצע הפיקסלים האטומים באותן עמודות
  const band = Math.max(2, Math.round(cw * 0.04));
  let sumY = 0, cnt = 0, r = 0, g = 0, b = 0;
  for (let y = minY; y <= maxY; y++) {
    for (const x0 of [minX, maxX - band + 1]) {
      for (let x = x0; x < x0 + band; x++) {
        const i = (y * w + x) * 4;
        if (data[i + 3] > 160) {
          sumY += y; cnt++;
          r += data[i]; g += data[i + 1]; b += data[i + 2];
        }
      }
    }
  }
  const hingeY = cnt ? (((sumY / cnt) - minY) / ch) * 120 : 45;
  const templeColor = cnt ? toHex(r / cnt, g / cnt, b / cnt) : '#222222';

  ctx.putImageData(imageData, 0, 0);
  const out = document.createElement('canvas');
  out.width = Math.min(OUTPUT_WIDTH, cw);
  out.height = Math.round(ch * (out.width / cw));
  out.getContext('2d')!.drawImage(canvas, minX, minY, cw, ch, 0, 0, out.width, out.height);

  return {
    dataUrl: out.toDataURL('image/png'),
    width: out.width,
    height: out.height,
    hingeY: Math.round(hingeY * 10) / 10,
    templeColor,
  };
}
