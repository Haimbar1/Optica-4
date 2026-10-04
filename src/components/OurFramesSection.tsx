import React, { useEffect, useState } from 'react';
import { Glasses, ScanFace } from 'lucide-react';
import { fetchFrames, UploadedFrame } from '../utils/framesApi';

interface OurFramesSectionProps {
  onTryOn: (frameId: string) => void;
}

// המסגרות שהעסק העלה בפורטל (אתר ← מסגרות למדידה). בלי מסגרות – הסקשן לא מוצג.
export const OurFramesSection: React.FC<OurFramesSectionProps> = ({ onTryOn }) => {
  const [frames, setFrames] = useState<UploadedFrame[]>([]);

  useEffect(() => {
    fetchFrames()
      .then(({ frames }) => setFrames(frames))
      .catch(() => {});
  }, []);

  if (!frames.length) return null;

  return (
    <section id="frames" className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#0047AB] text-xs font-bold">
            <Glasses className="w-4 h-4" />
            <span>מהחנות שלנו</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-['Rubik']">דגימה מהמסגרות שלנו</h2>
          <p className="text-gray-600">
            אהבתם מסגרת? לחצו "מדידה" וראו איך היא נראית עליכם במצלמה – ואז בואו למדוד בחנות.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {frames.map((frame) => (
            <div
              key={frame.id}
              className="group bg-[#FBFBFB] border-2 border-gray-100 hover:border-[#0047AB] rounded-2xl p-4 flex flex-col gap-3 transition-colors"
            >
              <div className="relative aspect-[8/3] flex items-center justify-center">
                <img
                  src={frame.image}
                  alt={frame.name}
                  loading="lazy"
                  className={`max-w-full max-h-full ${frame.inStock === false ? 'opacity-50' : ''}`}
                />
                {frame.inStock === false && (
                  <span className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    אזל מהמלאי כרגע
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 leading-tight">{frame.name}</div>
                <div className="text-sm text-gray-500">
                  {frame.style ? `${frame.style} · ` : ''}
                  <span className="font-bold text-[#0047AB]">{frame.price} ₪</span>
                </div>
                {frame.description && <p className="mt-1 text-xs text-gray-600 leading-snug">{frame.description}</p>}
              </div>
              <button
                onClick={() => onTryOn(frame.id)}
                className="w-full bg-[#0047AB] hover:bg-[#003580] text-white text-sm font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ScanFace className="w-4 h-4" />
                <span>מדידה</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
