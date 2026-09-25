// Diagnostic: does merely importing '@google/genai' crash the function?
import { GoogleGenAI } from '@google/genai';

export default function handler(req: any, res: any) {
  res.status(200).json({ ok: true, hasClass: typeof GoogleGenAI === 'function' });
}
