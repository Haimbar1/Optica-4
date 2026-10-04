import type { TryOnFrame } from '../data/tryOnFrames';

export interface UploadedFrame extends TryOnFrame {
  aspect: number;
  createdAt: string;
}

export interface NewFrameInput {
  name: string;
  style: string;
  price: number;
  aspect: number;
  hingeY: number;
  templeColor: string;
  imageData: string;
}

const BASE = '/api/frames';

async function request<T>(path: string, init: RequestInit = {}, password?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (password) headers.Authorization = `Bearer ${password}`;
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `שגיאה ${res.status}`);
  return body as T;
}

export const fetchFrames = () => request<{ frames: UploadedFrame[]; configured: boolean }>('');

export const loginAdmin = (password: string) =>
  request<{ ok: true; configured: boolean }>('/login', { method: 'POST' }, password);

export const addFrame = (password: string, input: NewFrameInput) =>
  request<{ frame: UploadedFrame }>('', { method: 'POST', body: JSON.stringify(input) }, password);

export const deleteFrame = (password: string, id: string) =>
  request<{ ok: boolean }>(`/${id}`, { method: 'DELETE' }, password);
