// The site is the "site" module (אתר) of the SmartEsek portal (portal.smartesek.com). Everything
// that is managed for it lives there, per business: the try-on frames (uploaded / hidden / deleted
// in the portal's site page, stored in the portal's database) and the keys in "מזהים וחיבורים".
//
// Which business this site is in the portal is fixed here in the code (an explicit id, not looked
// up by the site's address, and not a Vercel setting). The only thing in Vercel is
// SSO_SHARED_SECRET, the platform's shared secret that unlocks the vault itself.
import express from 'express';
import crypto from 'crypto';

const PORTAL_URL = 'https://portal.smartesek.com';
// האופטיקה הטובה – העסק המקורי בפורטל (/tenants/1 בכתובת של ריבוע "אתר")
const TENANT_ID = 1;
const FRAME_ID_PATTERN = /^[a-z0-9]{6,32}$/;

// ---- Try-on frames: read from the portal and served from this site's own origin, so the
// try-on page's canvas (save/share) never touches a cross-origin image. ----

export const framesRouter = express.Router();

framesRouter.get('/', async (req, res) => {
  try {
    const r = await fetch(`${PORTAL_URL}/api/public/site/${TENANT_ID}/frames`, { signal: AbortSignal.timeout(5000) });
    if (!r.ok) throw new Error(`portal ${r.status}`);
    const data: any = await r.json();
    const frames = (Array.isArray(data?.frames) ? data.frames : [])
      .filter((f: any) => FRAME_ID_PATTERN.test(String(f?.id)))
      .map((f: any) => ({ ...f, image: `/api/frames/${f.id}/image?v=${Number(f.imageVersion) || 1}` }));
    // בלי קאש: הסתרה או הוספה בפורטל מופיעה באתר מיד
    res.set('Cache-Control', 'no-store');
    res.json({ frames });
  } catch (err: any) {
    // The try-on page then keeps its sample frames
    console.warn('[frames] reading frames from the portal failed:', err?.message);
    res.json({ frames: [] });
  }
});

framesRouter.get('/:id/image', async (req, res) => {
  if (!FRAME_ID_PATTERN.test(req.params.id)) return res.sendStatus(404);
  try {
    // ?v= is the image version: it changes when the image is replaced in the portal, so a versioned
    // link can be cached for good; an unversioned one only briefly
    const version = /^\d{1,6}$/.test(String(req.query.v || '')) ? String(req.query.v) : '';
    const r = await fetch(`${PORTAL_URL}/api/public/site/frames/${req.params.id}/image${version ? `?v=${version}` : ''}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return res.sendStatus(r.status === 404 ? 404 : 502);
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', version ? 'public, max-age=31536000, immutable' : 'public, max-age=600');
    res.send(Buffer.from(await r.arrayBuffer()));
  } catch {
    res.sendStatus(502);
  }
});

// ---- Keys from the portal vault ("מזהים וחיבורים"), the same way the CRM reads its own: this is
// the portal's original business, so the Vercel environment variable comes first (many are marked
// sensitive there and can't be copied back) and the vault only where Vercel has none. ----

const CACHE_MS = 5 * 60 * 1000;
let vaultCache: { at: number; secrets: Record<string, string> } | null = null;

const b64url = (s: string | Buffer) => Buffer.from(s).toString('base64url');

// A short-lived HS256 JWT, as the portal's /api/sso/secrets expects
function signToken(payload: Record<string, unknown>, secret: string): string {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify({ ...payload, iat: now, exp: now + 30 }));
  const sig = crypto.createHmac('sha256', secret).update(`${head}.${body}`).digest('base64url');
  return `${head}.${body}.${sig}`;
}

async function vaultSecrets(): Promise<Record<string, string>> {
  if (vaultCache && Date.now() - vaultCache.at < CACHE_MS) return vaultCache.secrets;
  const sharedSecret = process.env.SSO_SHARED_SECRET;
  if (!sharedSecret) return {};
  try {
    const token = signToken({ typ: 'secrets', tenantId: TENANT_ID, module: 'site' }, sharedSecret);
    const r = await fetch(`${PORTAL_URL}/api/sso/secrets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) throw new Error(`portal ${r.status}`);
    const data: any = await r.json();
    const secrets = data?.secrets && typeof data.secrets === 'object' ? data.secrets : {};
    vaultCache = { at: Date.now(), secrets };
    return secrets;
  } catch (err: any) {
    console.warn('[secrets] reading the portal vault failed:', err?.message);
    // keep using the last good copy rather than dropping a working integration
    return vaultCache?.secrets || {};
  }
}

// One key. '' = not set anywhere.
export async function siteSecret(key: string): Promise<string> {
  return process.env[key] || (await vaultSecrets())[key] || '';
}
