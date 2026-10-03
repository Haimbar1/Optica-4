// אחסון מסגרות להדמיית המשקפיים שמועלות ממסך ההגדרות.
// בפרודקשן (Vercel) – Vercel Blob: חובה ליצור Blob Store ציבורי ולחבר אותו
// לפרויקט, מה שמוסיף אוטומטית את BLOB_READ_WRITE_TOKEN.
// בפיתוח מקומי בלי טוקן – תיקייה מקומית ‎.data/tryon-frames.
import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { put, list, del } from '@vercel/blob';

export interface StoredFrame {
  id: string;
  name: string;
  style: string;
  price: number;
  image: string;
  // יחס רוחב/גובה של התמונה, גובה הציר (0–120 מגובה התמונה) וצבע הידיות
  aspect: number;
  hingeY: number;
  templeColor: string;
  createdAt: string;
}

type FrameMeta = Omit<StoredFrame, 'id' | 'image' | 'createdAt'>;

interface FrameStore {
  list(): Promise<StoredFrame[]>;
  add(meta: FrameMeta, png: Buffer): Promise<StoredFrame>;
  remove(id: string): Promise<boolean>;
}

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ID_PATTERN = /^[a-z0-9]{6,32}$/;

const newId = () => Date.now().toString(36) + crypto.randomBytes(4).toString('hex');
const byCreatedAt = (a: StoredFrame, b: StoredFrame) => a.createdAt.localeCompare(b.createdAt);

const blobStore: FrameStore = {
  async list() {
    const metas: { url: string }[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: 'tryon/meta/', cursor });
      metas.push(...page.blobs);
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    // קובצי המטא-דאטה לא משתנים אחרי היצירה, כך שקאש של ה-CDN לא מזיק
    const frames = await Promise.all(
      metas.map(async (b) => {
        const res = await fetch(b.url);
        return res.ok ? ((await res.json()) as StoredFrame) : null;
      }),
    );
    return frames.filter((f): f is StoredFrame => f !== null).sort(byCreatedAt);
  },

  async add(meta, png) {
    const id = newId();
    const image = await put(`tryon/images/${id}.png`, png, {
      access: 'public',
      contentType: 'image/png',
      addRandomSuffix: true,
    });
    const frame: StoredFrame = { ...meta, id, image: image.url, createdAt: new Date().toISOString() };
    await put(`tryon/meta/${id}.json`, JSON.stringify(frame), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });
    return frame;
  },

  async remove(id) {
    const { blobs } = await list({ prefix: `tryon/meta/${id}.json` });
    const meta = blobs.find((b) => b.pathname === `tryon/meta/${id}.json`);
    if (!meta) return false;
    const frame = (await (await fetch(meta.url)).json()) as StoredFrame;
    await del([meta.url, frame.image]);
    return true;
  },
};

const LOCAL_DIR = path.join(process.cwd(), '.data', 'tryon-frames');
const LOCAL_IMAGE_ROUTE = '/api/frames/local-image';

const localStore: FrameStore = {
  async list() {
    if (!fs.existsSync(LOCAL_DIR)) return [];
    return fs
      .readdirSync(LOCAL_DIR)
      .filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(fs.readFileSync(path.join(LOCAL_DIR, f), 'utf8')) as StoredFrame)
      .sort(byCreatedAt);
  },

  async add(meta, png) {
    fs.mkdirSync(LOCAL_DIR, { recursive: true });
    const id = newId();
    fs.writeFileSync(path.join(LOCAL_DIR, `${id}.png`), png);
    const frame: StoredFrame = {
      ...meta,
      id,
      image: `${LOCAL_IMAGE_ROUTE}/${id}.png`,
      createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(path.join(LOCAL_DIR, `${id}.json`), JSON.stringify(frame));
    return frame;
  },

  async remove(id) {
    const metaPath = path.join(LOCAL_DIR, `${id}.json`);
    if (!fs.existsSync(metaPath)) return false;
    fs.rmSync(metaPath);
    fs.rmSync(path.join(LOCAL_DIR, `${id}.png`), { force: true });
    return true;
  },
};

function getStore(): FrameStore | null {
  if (process.env.BLOB_READ_WRITE_TOKEN) return blobStore;
  if (!process.env.VERCEL) return localStore;
  return null;
}

function passwordMatches(given: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof given !== 'string') return false;
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

const requireAdmin: express.RequestHandler = (req, res, next) => {
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'ADMIN_PASSWORD לא מוגדר בשרת' });
  }
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!passwordMatches(token)) {
    // השהיה קטנה כדי להאט ניחוש סיסמאות
    return setTimeout(() => res.status(401).json({ error: 'סיסמה שגויה' }), 600);
  }
  next();
};

function parseFrameInput(body: any): { meta: FrameMeta; png: Buffer } | string {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const style = typeof body?.style === 'string' ? body.style.trim() : '';
  const price = Number(body?.price);
  const aspect = Number(body?.aspect);
  const hingeY = Number(body?.hingeY);
  const templeColor = typeof body?.templeColor === 'string' ? body.templeColor : '';
  const imageData = typeof body?.imageData === 'string' ? body.imageData : '';

  if (!name || name.length > 40) return 'שם המסגרת חסר או ארוך מדי';
  if (style.length > 30) return 'הסגנון ארוך מדי';
  if (!Number.isFinite(price) || price < 0 || price > 10000) return 'מחיר לא תקין';
  if (!Number.isFinite(aspect) || aspect < 1 || aspect > 6) return 'יחס התמונה לא תקין';
  if (!Number.isFinite(hingeY) || hingeY < 0 || hingeY > 120) return 'גובה הציר לא תקין';
  if (!/^#[0-9a-f]{6}$/i.test(templeColor)) return 'צבע הידיות לא תקין';

  const prefix = 'data:image/png;base64,';
  if (!imageData.startsWith(prefix)) return 'התמונה חייבת להיות PNG';
  const png = Buffer.from(imageData.slice(prefix.length), 'base64');
  if (png.length > MAX_IMAGE_BYTES) return 'התמונה גדולה מדי';
  if (!png.subarray(0, 8).equals(PNG_SIGNATURE)) return 'קובץ PNG לא תקין';

  return { meta: { name, style, price: Math.round(price), aspect, hingeY, templeColor }, png };
}

export const framesRouter = express.Router();

// התמונה מגיעה כ-data URL בתוך JSON, ולכן צריך מגבלה גדולה מברירת המחדל
framesRouter.use(express.json({ limit: '5mb' }));

framesRouter.get('/', async (req, res) => {
  const store = getStore();
  if (!store) return res.json({ frames: [], configured: false });
  try {
    res.set('Cache-Control', 'no-store');
    res.json({ frames: await store.list(), configured: true });
  } catch (err) {
    console.error('Failed to list try-on frames', err);
    res.status(500).json({ error: 'שגיאה בטעינת המסגרות' });
  }
});

framesRouter.post('/login', requireAdmin, (req, res) => {
  res.json({ ok: true, configured: getStore() !== null });
});

framesRouter.post('/', requireAdmin, async (req, res) => {
  const store = getStore();
  if (!store) return res.status(503).json({ error: 'אחסון התמונות (Vercel Blob) לא מחובר לפרויקט' });
  const input = parseFrameInput(req.body);
  if (typeof input === 'string') return res.status(400).json({ error: input });
  try {
    res.json({ frame: await store.add(input.meta, input.png) });
  } catch (err) {
    console.error('Failed to save try-on frame', err);
    res.status(500).json({ error: 'שמירת המסגרת נכשלה' });
  }
});

framesRouter.delete('/:id', requireAdmin, async (req, res) => {
  const store = getStore();
  if (!store) return res.status(503).json({ error: 'אחסון התמונות לא מחובר' });
  if (!ID_PATTERN.test(req.params.id)) return res.status(400).json({ error: 'מזהה לא תקין' });
  try {
    const removed = await store.remove(req.params.id);
    res.status(removed ? 200 : 404).json({ ok: removed });
  } catch (err) {
    console.error('Failed to delete try-on frame', err);
    res.status(500).json({ error: 'מחיקת המסגרת נכשלה' });
  }
});

framesRouter.get('/local-image/:file', (req, res) => {
  const match = /^([a-z0-9]{6,32})\.png$/.exec(req.params.file);
  if (getStore() !== localStore || !match) return res.sendStatus(404);
  const file = path.join(LOCAL_DIR, `${match[1]}.png`);
  if (!fs.existsSync(file)) return res.sendStatus(404);
  res.sendFile(file);
});
