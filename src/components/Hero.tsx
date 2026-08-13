import React from 'react';
import { Calendar, Navigation, Phone, ShieldCheck, Glasses, Sparkles, CheckCircle2, HeartHandshake, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../data/opticsData';
import logoImg from '../assets/images/optics_logo_1786106308756.jpg';

interface HeroProps {
  onOpenBooking: () => void;
  onNavigateToCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onNavigateToCatalog }) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#F8F9FA] text-[#1A1A1A] py-12 lg:py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Main Hero Text (Left side in RTL) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F0FE] text-[#0047AB] text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4 text-[#0047AB]" />
              <span>חדש באמירים • מיזם אופטיקה חברתי</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1A1A1A] font-['Rubik'] leading-none">
              רואים צלול,
              <span className="block text-[#0047AB] mt-2">
                משלמים הוגן.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-2xl">
              אצלנו אתם לא משלמים על המותג שעל השלט או על השכירות בקניון. אופטיקה חברתית שחוסכת לכם את כל העלויות המיותרות.
              מסגרות מובחרות ועדשות איכותיות מ-
              <strong className="text-[#0047AB] font-bold px-1">150 ₪ עד 250 ₪ בלבד</strong>!
            </p>

            {/* Price Highlights Cards Grid (From Professional Polish design) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="p-5 rounded-2xl border-2 border-gray-100 bg-[#FBFBFB] hover:border-[#0047AB] transition-colors shadow-2xs">
                <div className="text-3xl font-black text-[#0047AB]">150-250₪</div>
                <div className="text-sm font-bold text-gray-700">מסגרת + עדשות וציפויים</div>
                <div className="text-[12px] text-gray-400 mt-1 italic">עבור מספרים נמוכים (במספרים גבוהים, תוספת עלות סמלית עבור דיקוק עדשה)</div>
              </div>
              <div className="p-5 rounded-2xl border-2 border-gray-100 bg-[#FBFBFB] hover:border-[#0047AB] transition-colors shadow-2xs">
                <div className="text-3xl font-black text-[#0047AB]">מולטיפוקל</div>
                <div className="text-sm font-bold text-gray-700">התאמה מקצועית וליווי</div>
                <div className="text-[12px] text-gray-400 mt-1 italic">עדשות מתקדמות בהתאמה אישית ואחריות על הסתגלות</div>
              </div>
            </div>

            {/* Address & Quick Info Banner */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-4 text-xs sm:text-sm space-y-2 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 text-gray-800 font-bold">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0 text-[#0047AB]" />
                  <span>כתובת העסק:</span>
                  <span className="text-[#0047AB] font-semibold">
                    {BUSINESS_INFO.address}
                  </span>
                </div>
                <div className="text-[11px] bg-[#E8F0FE] text-[#0047AB] px-2.5 py-0.5 rounded-full font-extrabold">
                  שעות פעילות: ד', ה' 12:00-18:00 | ו' 10:00-14:00
                </div>
              </div>
              <p className="text-gray-600">
                תורים לבדיקות ראייה (אביגיל): <a href={`tel:${BUSINESS_INFO.phoneAvigail}`} className="text-[#0047AB] font-bold hover:underline">{BUSINESS_INFO.phoneAvigail}</a> | צביקה: <a href={`tel:${BUSINESS_INFO.phoneZvika}`} className="text-[#0047AB] font-bold hover:underline">{BUSINESS_INFO.phoneZvika}</a>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onOpenBooking}
                className="bg-[#0047AB] hover:bg-[#003580] text-white font-bold text-base px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-white" />
                <span>קביעת תור לבדיקת ראייה</span>
              </button>

              <a
                href={BUSINESS_INFO.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold text-base px-5 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Navigation className="w-5 h-5 text-[#0047AB]" />
                <span>ניווט ב-Waze</span>
              </a>

              <button
                onClick={onNavigateToCatalog}
                className="text-[#0047AB] hover:underline font-bold text-sm px-3 py-2 cursor-pointer"
              >
                לצפייה בקטלוג המסגרות ←
              </button>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-200/70">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#0047AB] shrink-0" />
                <span>אופטומטריסט מוסמך</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#0047AB] shrink-0" />
                <span>עדשות מולטיפוקל</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#0047AB] shrink-0" />
                <span>מסגרת + עדשות מ-150₪</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#0047AB] shrink-0" />
                <span>אחריות וכיוונון מקצועי</span>
              </div>
            </div>
          </div>

          {/* Right Side Visual Image Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-white">
              <img
                src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80"
                alt="האופטיקה הטובה אמירים"
                className="w-full h-80 sm:h-96 object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={logoImg}
                    alt="האופטיקה הטובה"
                    className="w-9 h-9 rounded-lg object-cover border border-white/40 shadow-sm"
                  />
                  <div className="bg-[#0047AB] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-max">
                    מיזם אופטיקה חברתית
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white font-['Rubik']">
                  150 ₪ / 250 ₪
                </h3>
                <p className="text-gray-200 text-xs sm:text-sm mt-1 leading-normal">
                  מסגרות מכל הסוגים (פלסטיק, מתכת, טיטניום, אולטם) כולל עדשות איכותיות וציפויים!
                </p>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                    <HeartHandshake className="w-4 h-4" />
                    <span>איכות מירבית במחיר הוגן</span>
                  </div>
                  <span className="text-xs text-gray-300 font-semibold">אמירים</span>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white text-[#0047AB] p-4 rounded-2xl shadow-xl font-extrabold text-center border-2 border-[#E8F0FE] hidden sm:block">
              <span className="block text-2xl font-black text-[#0047AB]">100%</span>
              <span className="text-xs text-gray-600 font-bold">איכות ואמינות</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
