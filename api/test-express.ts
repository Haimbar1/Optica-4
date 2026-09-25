// Diagnostic: does a fresh Express app (no server.ts, no extra deps) work
// as a Vercel serverless function? Isolates whether Express itself is fine.
import express from 'express';

const app = express();
app.get('*', (req, res) => {
  res.status(200).json({ ok: true, source: 'api/test-express.ts' });
});

export default app;
