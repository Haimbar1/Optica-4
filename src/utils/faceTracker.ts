import type { FaceLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';
import wasmLoader from '@mediapipe/tasks-vision/vision_wasm_internal.js?url';
import wasmBinary from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url';
import wasmLoaderNoSimd from '@mediapipe/tasks-vision/vision_wasm_nosimd_internal.js?url';
import wasmBinaryNoSimd from '@mediapipe/tasks-vision/vision_wasm_nosimd_internal.wasm?url';

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

// נקודות ציון של MediaPipe Face Mesh
const RIGHT_EYE_OUTER = 33;
const LEFT_EYE_OUTER = 263;
const FOREHEAD = 10;
const CHIN = 152;

// רוחב תמונת המשקפיים ביחס למרחק בין זוויות העיניים החיצוניות
export const GLASSES_TO_EYE_SPAN = 1.65;

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

// טעינה עצלה – הספרייה והמודל (~15MB) נטענים רק כשנכנסים למדידה החיה
export function loadFaceLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
      const simd = await FilesetResolver.isSimdSupported();
      const fileset = simd
        ? { wasmLoaderPath: wasmLoader, wasmBinaryPath: wasmBinary }
        : { wasmLoaderPath: wasmLoaderNoSimd, wasmBinaryPath: wasmBinaryNoSimd };
      const create = (delegate: 'GPU' | 'CPU') =>
        FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate },
          runningMode: 'VIDEO',
          numFaces: 1,
        });
      try {
        return await create('GPU');
      } catch {
        return await create('CPU');
      }
    })();
    landmarkerPromise.catch(() => {
      landmarkerPromise = null;
    });
  }
  return landmarkerPromise;
}

// תנוחת הפנים בפיקסלים של המקור (אחרי שיקוף אם מבקשים). זוויות ברדיאנים,
// בכיווני CSS: roll עם כיוון השעון, yaw חיובי = הצד הימני במסך מתרחק,
// pitch חיובי = הסנטר מתקרב למצלמה.
export interface FacePose {
  x: number;
  y: number;
  eyeSpan: number;
  roll: number;
  yaw: number;
  pitch: number;
}

export function poseFromLandmarks(
  lm: NormalizedLandmark[],
  width: number,
  height: number,
  mirror: boolean,
): FacePose {
  // z של MediaPipe באותו קנה מידה כמו x; ערך גדול יותר = רחוק יותר מהמצלמה
  const p = (i: number) => ({
    x: (mirror ? 1 - lm[i].x : lm[i].x) * width,
    y: lm[i].y * height,
    z: lm[i].z * width,
  });
  const r = p(RIGHT_EYE_OUTER);
  const l = p(LEFT_EYE_OUTER);
  // במראה העין הימנית של האדם מופיעה בצד ימין של המסך
  const [screenLeft, screenRight] = mirror ? [l, r] : [r, l];
  const v = {
    x: screenRight.x - screenLeft.x,
    y: screenRight.y - screenLeft.y,
    z: screenRight.z - screenLeft.z,
  };
  const flat = Math.hypot(v.x, v.y);

  const top = p(FOREHEAD);
  const bottom = p(CHIN);
  const w = { x: bottom.x - top.x, y: bottom.y - top.y, z: bottom.z - top.z };

  return {
    x: (r.x + l.x) / 2,
    y: (r.y + l.y) / 2,
    eyeSpan: Math.hypot(v.x, v.y, v.z),
    roll: Math.atan2(v.y, v.x),
    yaw: Math.atan2(v.z, flat),
    pitch: Math.atan2(-w.z, Math.hypot(w.x, w.y)),
  };
}
