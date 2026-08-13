import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/opticsData';
import { MapPin, Navigation, Phone, Clock, ExternalLink, Glasses, Footprints, Car, DoorOpen, ZoomIn, X } from 'lucide-react';

const arrivalGuideImg = 'https://i.ibb.co/hJJ4XpH0/image.png';

export const ContactLocationSection: React.FC = () => {
  const [showFullGuideModal, setShowFullGuideModal] = useState(false);

  return (
    <section id="contact" className="py-16 bg-[#F8F9FA] text-[#1A1A1A] relative border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#0047AB] text-xs font-bold">
            <Footprints className="w-4 h-4 text-[#0047AB]" />
            <span>מדריך הגעה לחנות האופטיקה</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 font-['Rubik'] tracking-tight">
            הוראות הגעה מפורטות לחנות
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            מצפה מנחם 86, מושב אמירים. עקבו אחר המדריך הקצר והפשוט להגעה מהירה ומזרזת.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Business Details Card */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0047AB] text-white flex items-center justify-center font-bold">
                    <Glasses className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 font-['Rubik']">
                      {BUSINESS_INFO.name}
                    </h3>
                    <p className="text-xs text-[#0047AB] font-semibold">{BUSINESS_INFO.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Exact Location */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  📍 כתובת העסק:
                </span>
                <p className="text-xl font-bold text-[#0047AB] font-['Rubik'] flex items-center gap-2">
                  <span>{BUSINESS_INFO.address}</span>
                </p>
                <p className="text-xs text-gray-600">
                  מושב אמירים, גליל עליון (חניה נוחה לרכבים במקום)
                </p>
              </div>

              {/* Navigation Button */}
              <div className="pt-2">
                <a
                  href={BUSINESS_INFO.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0047AB] hover:bg-[#003580] text-white font-extrabold text-base py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2.5"
                >
                  <Navigation className="w-5 h-5 fill-white text-white" />
                  <span>ניווט ישיר ב-Waze (וויז)</span>
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </a>
              </div>

              {/* Phones & Contacts */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  📞 טלפונים לשאלות ובירורים:
                </span>

                <div className="grid grid-cols-1 gap-2.5 text-xs">
                  <div className="bg-[#FBFBFB] p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                    <span className="font-extrabold text-[#0047AB]">אביגיל (תורים):</span>
                    <a href={`tel:${BUSINESS_INFO.phoneAvigail}`} className="font-bold text-gray-900 hover:underline">
                      {BUSINESS_INFO.phoneAvigail}
                    </a>
                  </div>

                  <div className="bg-[#FBFBFB] p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                    <span className="font-extrabold text-gray-700">צביקה (בירורים/ביטולים):</span>
                    <a href={`tel:${BUSINESS_INFO.phoneZvika}`} className="font-bold text-gray-900 hover:underline">
                      {BUSINESS_INFO.phoneZvika}
                    </a>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-[11px] text-gray-600 text-center font-bold">
                    טלפונים נוספים בחנות: 054-540-4183 | 053-534-6643 | 055-250-2584
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
              <span>הגעה בתיאום מראש בלבד</span>
              <span>מצפה מנחם 86, אמירים</span>
            </div>
          </div>

          {/* Directions & Arrival Guide Poster Card */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900 font-['Rubik'] flex items-center gap-2">
                  <Footprints className="w-6 h-6 text-[#0047AB]" />
                  <span>מדריך הגעה מצולם</span>
                </h3>

                <button
                  onClick={() => setShowFullGuideModal(true)}
                  className="text-xs font-bold text-[#0047AB] bg-[#E8F0FE] hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>הגדל קובץ מדריך</span>
                </button>
              </div>

              {/* Step-by-Step Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Step 1 */}
                <div className="bg-[#F8F9FA] border border-gray-200 rounded-2xl p-4 space-y-2 text-right">
                  <div className="w-8 h-8 rounded-xl bg-[#0047AB] text-white font-black text-sm flex items-center justify-center">
                    1
                  </div>
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5 font-['Rubik']">
                    <Car className="w-4 h-4 text-[#0047AB]" />
                    <span>הגעת ליעד</span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    הגעה עם הרכב עד לחניה במצפה מנחם 86.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-[#F8F9FA] border border-gray-200 rounded-2xl p-4 space-y-2 text-right">
                  <div className="w-8 h-8 rounded-xl bg-[#0047AB] text-white font-black text-sm flex items-center justify-center">
                    2
                  </div>
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5 font-['Rubik']">
                    <Footprints className="w-4 h-4 text-[#0047AB]" />
                    <span>ירידה רגלית</span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    המשך ירידה רגלית קצרה בשביל.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-[#F8F9FA] border border-gray-200 rounded-2xl p-4 space-y-2 text-right">
                  <div className="w-8 h-8 rounded-xl bg-[#0047AB] text-white font-black text-sm flex items-center justify-center">
                    3
                  </div>
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5 font-['Rubik']">
                    <DoorOpen className="w-4 h-4 text-[#0047AB]" />
                    <span>כניסה לחנות</span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    כניסה לחנות האופטיקה במדרגות.
                  </p>
                </div>
              </div>

              {/* Arrival Guide Image Display */}
              <div
                onClick={() => setShowFullGuideModal(true)}
                className="relative rounded-2xl overflow-hidden border-2 border-blue-100 bg-gray-50 cursor-pointer group shadow-xs hover:shadow-md transition-all"
              >
                <img
                  src={arrivalGuideImg}
                  alt="מדריך הגעה לחנות האופטיקה באמירים"
                  className="w-full h-auto max-h-[380px] object-contain mx-auto group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-black/80 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                    <span>לחץ להגדלה במסך מלא</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8F0FE] border border-blue-200 text-xs text-[#0047AB] flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Clock className="w-5 h-5 text-[#0047AB] shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-extrabold block sm:inline ml-2">שעות הפעילות בחנות:</span>
                <span>ימים ד', ה': 12:00-18:00 | יום ו': 10:00-14:00 (בתיאום מראש)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal Preview for Arrival Guide Image */}
      {showFullGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xl font-black text-gray-900 font-['Rubik']">
                מדריך הגעה לחנות האופטיקה - מצפה מנחם 86
              </h3>
              <button
                onClick={() => setShowFullGuideModal(false)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="סגור"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex justify-center">
              <img
                src={arrivalGuideImg}
                alt="מדריך הגעה מוגדל"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={BUSINESS_INFO.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0047AB] hover:bg-[#003580] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>פתיחת Waze לניווט</span>
              </a>

              <button
                onClick={() => setShowFullGuideModal(false)}
                className="bg-gray-100 text-gray-800 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-gray-200"
              >
                סגור מדריך
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
