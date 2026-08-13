import React, { useState, useMemo } from 'react';
import { CATALOG_FRAMES } from '../data/opticsData';
import { FrameItem, PriceTier } from '../types';
import { Eye, Check, Calendar, Sparkles, SlidersHorizontal, Glasses } from 'lucide-react';

interface CatalogSectionProps {
  onSelectFrameForBooking: (frame: FrameItem) => void;
  onOpenTryOn: (frame: FrameItem) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  onSelectFrameForBooking,
  onOpenTryOn,
}) => {
  const [selectedPrice, setSelectedPrice] = useState<PriceTier | 'ALL'>('ALL');
  const [selectedFrameModal, setSelectedFrameModal] = useState<FrameItem | null>(null);

  const filteredFrames = useMemo(() => {
    return CATALOG_FRAMES.filter((frame) => {
      if (selectedPrice !== 'ALL' && frame.price !== selectedPrice) {
        return false;
      }
      return true;
    });
  }, [selectedPrice]);

  const resetFilters = () => {
    setSelectedPrice('ALL');
  };

  return (
    <section id="catalog" className="py-16 bg-[#F8F9FA] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#0047AB] text-xs font-bold">
            <Glasses className="w-4 h-4 text-[#0047AB]" />
            <span>קטלוג המסגרות החברתי שלנו</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-['Rubik'] tracking-tight">
            מסגרות איכותיות ב-150 ₪ או 250 ₪
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            מגוון ענק של מסגרות מכל הסוגים - פלסטיק, מתכת, טיטניום, אולטם, ברגים וחצי מסגרת.
            <br />
            <strong className="text-[#0047AB] font-bold">כל המחירים כוללים עדשות ראייה איכותיות וציפויים מלאים!</strong>
          </p>
        </div>

        {/* Price Filter Toolbar */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Price Filters */}
          <div className="space-y-1.5 w-full sm:w-auto">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0047AB]" />
              <span>סינון לפי מחיר (כולל עדשות):</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPrice('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPrice === 'ALL'
                    ? 'bg-[#0047AB] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                כל המחירים
              </button>
              <button
                onClick={() => setSelectedPrice(150)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPrice === 150
                    ? 'bg-[#0047AB] text-white shadow-xs'
                    : 'bg-blue-50 text-[#0047AB] border border-blue-200 hover:bg-blue-100'
                }`}
              >
                150 ₪ (בסיס חברתי)
              </button>
              <button
                onClick={() => setSelectedPrice(200)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPrice === 200
                    ? 'bg-[#0047AB] text-white shadow-xs'
                    : 'bg-[#E8F0FE] text-[#0047AB] border border-blue-200 hover:bg-blue-100'
                }`}
              >
                200 ₪ (אולטם / שמש)
              </button>
              <button
                onClick={() => setSelectedPrice(300)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPrice === 300
                    ? 'bg-[#0047AB] text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                300 ₪ (טיטניום / מולטיפוקל)
              </button>
            </div>
          </div>

          <div className="text-xs font-bold text-gray-500 shrink-0">
            מציג <span className="text-[#0047AB] font-extrabold text-sm">{filteredFrames.length}</span> מסגרות
          </div>
        </div>

        {/* Frames Grid */}
        {filteredFrames.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
            <Glasses className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800">לא נמצאו מסגרות תואמות לסינון</h3>
            <p className="text-gray-500 text-sm">נסו לשנות את הפרמטרים בסינון או לאפס אותו.</p>
            <button
              onClick={resetFilters}
              className="mt-2 inline-flex items-center gap-2 bg-[#0047AB] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              הצג את כל הקטלוג
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFrames.map((frame) => (
              <div
                key={frame.id}
                className="bg-white rounded-2xl border-2 border-gray-100 hover:border-[#0047AB] shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-4/3 bg-gray-50 overflow-hidden">
                    <img
                      src={frame.image}
                      alt={frame.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Price Tag Badge */}
                    <div className="absolute top-3 right-3 bg-[#0047AB] text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md">
                      {frame.price} ₪ כולל עדשות!
                    </div>

                    {/* Material Tag */}
                    <div className="absolute bottom-3 right-3 bg-gray-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                      {frame.material}
                    </div>

                    {/* Popular Tag */}
                    {frame.popular && (
                      <div className="absolute top-3 left-3 bg-[#E8F0FE] text-[#0047AB] text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 border border-blue-200">
                        <Sparkles className="w-3 h-3 text-[#0047AB]" />
                        <span>מומלץ</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-lg text-gray-900 font-['Rubik'] group-hover:text-[#0047AB] transition-colors">
                        {frame.name}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {frame.description}
                    </p>

                    {/* Colors & Features */}
                    <div className="pt-2 flex flex-wrap gap-1 text-[11px] text-gray-500">
                      <span className="font-bold text-gray-700">צבעים:</span>
                      {frame.colors.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenTryOn(frame)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0047AB]" />
                      <span>נסה הדמיה</span>
                    </button>

                    <button
                      onClick={() => setSelectedFrameModal(frame)}
                      className="w-full bg-[#E8F0FE] hover:bg-blue-100 text-[#0047AB] border border-blue-200 text-xs font-bold py-2 rounded-xl transition-colors"
                    >
                      פרטים מלאים
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectFrameForBooking(frame)}
                    className="w-full bg-[#0047AB] hover:bg-[#003580] text-white text-xs font-extrabold py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>הזמן בדיקה ומסגרת זו</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Full Frame Details */}
        {selectedFrameModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border border-slate-200">
              <button
                onClick={() => setSelectedFrameModal(null)}
                className="absolute top-4 left-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full"
              >
                ✕
              </button>

              <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={selectedFrameModal.image}
                  alt={selectedFrameModal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 font-['Rubik']">
                    {selectedFrameModal.name}
                  </h3>
                  <span className="text-xl font-extrabold text-teal-700">
                    {selectedFrameModal.price} ₪
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-600 mt-1">
                  מחיר סופי כולל מסגרת, עדשות וציפויים מלאים!
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedFrameModal.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800">מאפיינים מרכזיים:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedFrameModal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    const frame = selectedFrameModal;
                    setSelectedFrameModal(null);
                    onOpenTryOn(frame);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-teal-700" />
                  <span>הדמיה על הפנים</span>
                </button>

                <button
                  onClick={() => {
                    const frame = selectedFrameModal;
                    setSelectedFrameModal(null);
                    onSelectFrameForBooking(frame);
                  }}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>תיאום תור למסגרת זו</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
