// Vercel serverless entry point: catches every request under /api/*
// (filesystem-based catch-all routing) and hands it to our existing
// Express app, so all the routes defined in server.ts (crm/lead,
// appointments, bot webhooks, ai-chat, health) work in production too.
// Node's native ESM loader (which Vercel's Node runtime uses here, since
// package.json has "type": "module") requires an explicit file extension
// on relative imports — '../server' alone throws ERR_MODULE_NOT_FOUND.
import app from '../server.js';

export default app;
