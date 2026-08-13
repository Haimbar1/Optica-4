import React, { useState } from 'react';
import { FrameItem } from '../types';
import { X, Upload, Eye, Glasses, ZoomIn, ZoomOut, Move, Check } from 'lucide-react';

interface TryOnModalProps {
  frame: FrameItem | null;
  onClose: () => void;
  onSelectForBooking: (frame: FrameItem) => void;
}

export const TryOnModal: React.FC<TryOnModalProps> = ({ frame, onClose, onSelectForBooking }) => {
  const [userImage, setUserImage] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  );
  const [glassesScale, setGlassesScale] = useState<number>(100);
  const [glassesOffsetY, setGlassesOffsetY] = useState<number>(0);
  const [glassesOffsetX, setGlassesOffsetX] = useState<number>(0);

  if (!frame) return null;

  const sampleModels = [
    { label: 'אישה', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { label: 'גבר', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
    { label: 'אישה 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-right pr-2">
          <div className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-teal-500/30">
            <Eye className="w-3.5 h-3.5" />
            <span>הדמיית משקפיים וירטואלית</span>
          </div>
          <h3 className="text-2xl font-black font-['Rubik'] mt-1">
            נסה את {frame.name} ({frame.price} ₪)
          </h3>
          <p className="text-xs text-slate-400">
            בחר דוגמן, העלה תמונה שלך והתאם את מיקום המסגרת
          </p>
        </div>

        {/* Model Avatar Canvas Simulation Area */}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center select-none">
          <img
            src={userImage}
            alt="הדמיית פנים"
            className="w-full h-full object-cover"
          />

          {/* Glasses Overlay */}
          <div
            className="absolute pointer-events-none transition-transform duration-75"
            style={{
              transform: `translate(${glassesOffsetX}px, ${glassesOffsetY}px) scale(${glassesScale / 100})`,
              width: '55%',
            }}
          >
            <img
              src={frame.image}
              alt={frame.name}
              className="w-full h-auto drop-shadow-2xl mix-blend-multiply opacity-90 filter contrast-125 brightness-95"
            />
          </div>
        </div>

        {/* Controls Bar */}
        <div className="space-y-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-slate-300">גודל המסגרת:</span>
            <div className="flex items-center gap-2">
              <ZoomOut
                onClick={() => setGlassesScale(Math.max(60, glassesScale - 10))}
                className="w-4 h-4 cursor-pointer text-slate-400 hover:text-white"
              />
              <input
                type="range"
                min="60"
                max="150"
                value={glassesScale}
                onChange={(e) => setGlassesScale(Number(e.target.value))}
                className="w-28 accent-teal-500 cursor-pointer"
              />
              <ZoomIn
                onClick={() => setGlassesScale(Math.min(150, glassesScale + 10))}
                className="w-4 h-4 cursor-pointer text-slate-400 hover:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-slate-300">מיקום אנכי:</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-60"
                max="60"
                value={glassesOffsetY}
                onChange={(e) => setGlassesOffsetY(Number(e.target.value))}
                className="w-28 accent-teal-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Model Pickers or Photo Upload */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">בחר פנים:</span>
              {sampleModels.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setUserImage(m.url)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                    userImage === m.url ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <label className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>העלה תמונה שלך</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition-colors"
          >
            סגור הדמיה
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectForBooking(frame);
            }}
            className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            <Glasses className="w-4 h-4" />
            <span>אהבתי! קבע תור למסגרת זו</span>
          </button>
        </div>
      </div>
    </div>
  );
};
