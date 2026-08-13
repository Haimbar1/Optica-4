import React from 'react';
import { BUSINESS_INFO } from '../data/opticsData';
import { Calendar, Clock, Phone, HeartHandshake, MessageCircle } from 'lucide-react';

export const AppointmentSection: React.FC = () => {
  return (
    <section id="booking" className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Primary Automated Calendar Booking Callout Banner */}
        <div className="bg-gradient-to-br from-[#0047AB] to-[#002D6B] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="max-w-4xl mx-auto grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3 text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-bold backdrop-blur-xs">
                <Calendar className="w-4 h-4 text-white" />
                <span>מערכת תורים אוטומטית 24/7</span>
              </span>

              <h2 className="text-2xl sm:text-3xl font-black font-['Rubik'] leading-tight">
                קביעת תור מהירה ביומן הדיגיטלי
              </h2>

              <p className="text-blue-100 text-sm leading-relaxed">
                בלחיצה על הקישור הבא, תועבר למערכת האוטומטית שלנו לקביעת תורים ביומן:
              </p>

              {/* Working Hours Display */}
              <div className="pt-2 flex flex-wrap gap-3 text-xs">
                <span className="font-extrabold text-white">שעות הפעילות שלנו:</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg text-blue-100 font-semibold">
                  ימים ד', ה': 12:00-18:00
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg text-blue-100 font-semibold">
                  יום ו': 10:00-14:00
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col justify-center">
              <a
                href={BUSINESS_INFO.calComUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white hover:bg-gray-100 text-[#0047AB] font-black text-sm sm:text-base py-4 px-5 rounded-2xl shadow-md transition-all text-center flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>קביעת תור לבדיקת ראייה באופטיקה הטובה אמירים</span>
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Cards & Social Etiquette Notice */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#0047AB] text-xs font-bold">
              <Clock className="w-4 h-4 text-[#0047AB]" />
              <span>שעות פעילות ויצירת קשר</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Rubik'] tracking-tight">
              מעדיפים ליצור קשר טלפוני או בוואטסאפ?
            </h3>
            <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">
              ניתן לקבוע תור גם בטלפון או ב-WhatsApp מול אביגיל או צביקה. הבדיקה מבוצעת ע"י אופטומטריסט מוסמך במצפה מנחם 86, אמירים.
            </p>
          </div>

          {/* Social Etiquette Request Callout */}
          <div className="bg-[#E8F0FE]/50 border-2 border-[#0047AB]/20 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center shrink-0 mt-0.5">
                <HeartHandshake className="w-6 h-6 text-[#0047AB]" />
              </div>
              <div className="space-y-1.5 text-right">
                <h4 className="font-extrabold text-base text-[#0047AB]">
                  🪻 בקשה קטנה וחשובה מאיתנו
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  המיזם החברתי שלנו פועל בתלות במספר הנרשמים. לכן, נודה מאוד אם תקפיד/י לא לבטל תור (במיוחד ביום הפגישה).
                </p>
                <p className="text-xs font-bold text-gray-800">
                  אם קרה משהו בלתי צפוי, אנא הודיעו לנו מראש בוואטסאפ:
                  <a href={BUSINESS_INFO.whatsappDirectZvika} target="_blank" rel="noopener noreferrer" className="underline font-black mr-1 text-[#0047AB]">
                    055-250-2584 (צביקה)
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Team Contact Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Avigail Card */}
            <div className="bg-[#FBFBFB] rounded-2xl p-5 border border-gray-200 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  א
                </div>
                <div>
                  <h5 className="font-extrabold text-base text-gray-900">אביגיל</h5>
                  <p className="text-xs text-[#0047AB] font-bold">אחראית תורים לבדיקות ראייה</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2 text-xs">
                <a
                  href={`tel:${BUSINESS_INFO.phoneAvigail}`}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 p-2.5 rounded-xl border border-gray-200 font-bold text-gray-800 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#0047AB]" />
                  <span>{BUSINESS_INFO.phoneAvigail}</span>
                </a>

                <a
                  href={BUSINESS_INFO.whatsappDirectAvigail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white p-2.5 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>וואטסאפ לאביגיל</span>
                </a>
              </div>
            </div>

            {/* Zvika Card */}
            <div className="bg-[#FBFBFB] rounded-2xl p-5 border border-gray-200 space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  צ
                </div>
                <div>
                  <h5 className="font-extrabold text-base text-gray-900">צביקה</h5>
                  <p className="text-xs text-gray-600 font-bold">פניות כלליות ועדכוני תור</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2 text-xs">
                <a
                  href={`tel:${BUSINESS_INFO.phoneZvika}`}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 p-2.5 rounded-xl border border-gray-200 font-bold text-gray-800 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span>{BUSINESS_INFO.phoneZvika}</span>
                </a>

                <a
                  href={BUSINESS_INFO.whatsappDirectZvika}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white p-2.5 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>וואטסאפ לצביקה</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

