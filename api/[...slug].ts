// Vercel serverless entry point: catches every request under /api/*
// (filesystem-based catch-all routing) and hands it to our existing
// Express app, so all the routes defined in server.ts (crm/lead,
// appointments, bot webhooks, ai-chat, health) work in production too.
import app from '../server';

export default app;
