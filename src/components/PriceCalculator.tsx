import React, { useState } from 'react';
import { Calculator, Check, Glasses, Clock, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

interface PriceCalculatorProps {
  onOpenBookingWithParams: (details: string) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ onOpenBookingWithParams }) => {
  const [lensType, setLensType] = useState<'REGULAR' | 'MULTIFOCAL' | 'CONTACT_LENSES'>('REGULAR');
  const [framePrice, setFramePrice] = useState<150 | 250 | 300>(150);
  const [prescriptionType, setPrescriptionType] = useState<'LOW' | 'HIGH_CYLINDER'>('LOW');

  // Calculation Logic
  let basePrice = framePrice;
  let addOnPrice = prescriptionType === 'HIGH_CYLINDER' ? 50 : 0;
  if (lensType === 'MULTIFOCAL') {
    addOnPrice += 150; // nominal add-on for advanced multifocal
  }

  const totalPrice = basePrice + addOnPrice;
  const deliveryDays = lensType === 'MULTIFOCAL' || prescriptionType === 'HIGH_CYLINDER' ? 'עד 14 ימי עסקים' : 'עד 10 ימי עסקים';

  const handleBooking = () => {
    const textDesc = `מחשבון: ${
      lensType === 'REGULAR' ? 'משקפי מרחק/קריאה (מרשם רגיל)' : lensType === 'MULTIFOCAL' ? 'מולטיפוקל' : 'עדשות מגע מולטיפוקל'
    }, מסגרת ${framePrice} ₪, ${
      prescriptionType === 'HIGH_CYLINDER' ? 'צילינדר/מספר גבוה' : 'מספר נמוך רגיל'
    } | אומדן מחיר: ${totalPrice} ₪`;

    onOpenBookingWithParams(textDesc);
  };

  return (
    <section id="calculator" className="py-16 bg-[#F8F9FA] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#0047AB] text-xs font-bold">
            <Calculator className="w-4 h-4 text-[#0047AB]" />
            <span>שקיפות מלאה במחיר</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-['Rubik'] tracking-tight">
            מחשבון מחיר ושירות שקוף
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            בחרו את הצרכים האופטיים שלכם וקבלו אומדן עלות מדויק בזמן אמת, כולל מסגרת, עדשות וציפויים.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Options Selectors */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            {/* Step 1: Lens Type */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                <Glasses className="w-4 h-4 text-[#0047AB]" />
                <span>1. סוג העדשות / השימוש:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setLensType('REGULAR')}
                  className={`p-3 rounded-2xl border text-right transition-all ${
                    lensType === 'REGULAR'
                      ? 'bg-[#E8F0FE] border-[#0047AB] text-[#0047AB] font-extrabold ring-1 ring-[#0047AB]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-xs font-bold">מרחק / קריאה</span>
                  <span className="text-[11px] text-gray-500">מרשם רגיל</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLensType('MULTIFOCAL')}
                  className={`p-3 rounded-2xl border text-right transition-all ${
                    lensType === 'MULTIFOCAL'
                      ? 'bg-[#E8F0FE] border-[#0047AB] text-[#0047AB] font-extrabold ring-1 ring-[#0047AB]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-xs font-bold">משקפי מולטיפוקל</span>
                  <span className="text-[11px] text-gray-500">ראייה לכל מרחק</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLensType('CONTACT_LENSES')}
                  className={`p-3 rounded-2xl border text-right transition-all ${
                    lensType === 'CONTACT_LENSES'
                      ? 'bg-[#E8F0FE] border-[#0047AB] text-[#0047AB] font-extrabold ring-1 ring-[#0047AB]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-xs font-bold">עדשות מגע</span>
                  <span className="text-[11px] text-gray-500">התאמה מיוחדת</span>
                </button>
              </div>
            </div>

            {/* Step 2: Frame Category Price */}
            {lensType !== 'CONTACT_LENSES' && (
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-800">
                  2. רמת מחיר המסגרת שתבחרו:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFramePrice(150)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      framePrice === 150
                        ? 'bg-[#E8F0FE] border-[#0047AB] text-[#0047AB] font-extrabold ring-1 ring-[#0047AB]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-sm font-black">150 ₪</span>
                    <span className="text-[10px] text-gray-500">מסגרת פלסטיק/אולטם</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFramePrice(200)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      framePrice === 200
                        ? 'bg-[#E8F0FE] border-[#0047AB] text-[#0047AB] font-extrabold ring-1 ring-[#0047AB]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-sm font-black">200 ₪</span>
                    <span className="text-[10px] text-gray-500">מתכת/שמש</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFramePrice(300)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      framePrice === 300
                        ? 'bg-[#E8F0FE] border-[#0047AB] text-[#0047AB] font-extrabold ring-1 ring-[#0047AB]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-sm font-black">300 ₪</span>
                    <span className="text-[10px] text-gray-500">טיטניום/ללא מסגרת</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Prescription Range */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-800">
                3. מורכבות המרשם:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPrescriptionType('LOW')}
                  className={`p-3 rounded-2xl border text-right transition-all ${
                    prescriptionType === 'LOW'
                      ? 'bg-[#E8F0FE] border-[#0047AB] text-[#0047AB] font-extrabold ring-1 ring-[#0047AB]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-xs font-bold">מספר רגיל / נמוך</span>
                  <span className="text-[10px] text-[#0047AB] font-bold">כולל במחיר המסגרת!</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrescriptionType('HIGH_CYLINDER')}
                  className={`p-3 rounded-2xl border text-right transition-all ${
                    prescriptionType === 'HIGH_CYLINDER'
                      ? 'bg-[#E8F0FE] border-[#0047AB] text-[#0047AB] font-extrabold ring-1 ring-[#0047AB]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-xs font-bold">מספר גבוה / תוספת צילינדר</span>
                  <span className="text-[10px] text-gray-500">תוספת סמלית בלבד (+50 ₪)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Live Summary Card */}
          <div className="lg:col-span-5 bg-[#0047AB] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-blue-800 space-y-5">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <span className="text-xs font-extrabold text-blue-100">סיכום אומדן עלות</span>
              <span className="text-xs text-blue-200">האופטיקה הטובה אמירים</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-blue-100">סה"כ מחיר משוער:</span>
              <div className="text-4xl sm:text-5xl font-black text-white font-['Rubik']">
                {totalPrice} ₪
              </div>
              <p className="text-xs text-blue-100 font-bold">
                כולל מסגרת, עדשות וציפויים מלאים!
              </p>
            </div>

            <div className="space-y-2 text-xs text-blue-100 pt-2 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-200 shrink-0" />
                <span>זמן אספקה משוער: <strong>{deliveryDays}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>כולל בדיקה יסודית וכיוונון ברכישה</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>הודעת וואטסאפ מניעה כאשר מוכן</span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-white hover:bg-gray-100 text-[#0047AB] font-black py-3.5 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>תיאום תור לבדיקה עם מפרט זה</span>
              <ArrowRight className="w-4 h-4 rotate-180 text-[#0047AB]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
