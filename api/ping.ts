// Minimal diagnostic function that does NOT import server.ts at all.
// If /api/ping works but /api/health (which goes through server.ts) still
// fails, that proves the crash is specifically inside importing server.ts
// (a dependency or runtime issue), not a general Vercel Functions problem.
export default function handler(req: any, res: any) {
  res.status(200).json({ ok: true, source: 'api/ping.ts', time: new Date().toISOString() });
}
