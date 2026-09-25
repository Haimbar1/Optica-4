// Vercel serverless entry point. vercel.json rewrites every request under
// /api/* to this single function, which hands it to our existing Express
// app, so all the routes defined in server.ts (crm/lead, appointments, bot
// webhooks, ai-chat, health) work in production too.
//
// We rely on an explicit vercel.json rewrite rather than the filesystem
// catch-all convention (api/[...slug].ts): in testing, that convention
// only matched a single path segment under /api/ (e.g. /api/health worked
// but /api/crm/lead and /api/bot/web 404'd at the platform level, never
// reaching this code at all).
//
// Node's native ESM loader (which Vercel's Node runtime uses here, since
// package.json has "type": "module") requires an explicit file extension
// on relative imports — '../server' alone throws ERR_MODULE_NOT_FOUND.
import app from '../server.js';

export default app;
