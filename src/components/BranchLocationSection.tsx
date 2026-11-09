import React from 'react';
import { MapPin, Navigation, Phone, Clock, MessageCircle, Calendar, ExternalLink } from 'lucide-react';
import { Branch, mapEmbedUrl, whatsappLink, branchPhone, displayPhone, branchWhatsapp } from '../data/branches';
import { HoursGrid } from '../branchContext';

interface BranchLocationSectionProps {
  branch: Branch;
  onOpenBooking: () => void;
}

// A branch's "where and when": address, hours, phones, map and the towns it serves.
// (אמירים keeps its own detailed arrival guide, ContactLocationSection.)
export const BranchLocationSection: React.FC<BranchLocationSectionProps> = ({ branch, onOpenBooking }) => {
  const hasPlace = !!(branch.address || branch.geo);
  return (
    <section id="contact" className="py-16 bg-[#F8F9FA] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-['Rubik'] tracking-tight">
            האופטיקה החברתית {branch.inName}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            {branch.comingSoon
              ? `הסניף ${branch.inName} נפתח בקרוב — בדיקת ראייה חינם, משקפי ראייה מלאים ב-150 ₪ ועדשות מולטיפוקל. השאירו פרטים ונעדכן אתכם בפתיחה.`
              : `בדיקת ראייה חינם, משקפי ראייה מלאים ב-150 ₪ ועדשות מולטיפוקל — עכשיו גם ${branch.inName}.`}
          </p>
        </div>

        <div className={`grid gap-8 items-stretch ${hasPlace ? 'lg:grid-cols-12' : 'max-w-2xl mx-auto'}`}>
          <div className={`${hasPlace ? 'lg:col-span-5' : ''} bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs`}>
            <div className="bg-gradient-to-br from-[#E8F0FE] to-blue-50/80 border-2 border-[#0047AB]/40 rounded-2xl p-5 space-y-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#0047AB] bg-white px-2.5 py-1 rounded-full border border-[#0047AB]/20">
                <MapPin className="w-4 h-4" />
                סניף {branch.name}
              </span>
              <p className="text-2xl sm:text-3xl font-black text-[#0047AB] font-['Rubik'] leading-tight">
                {branch.address || branch.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                {branch.address ? branch.areaNote : 'הכתובת המדויקת תישלח אליכם עם אישור התור'}
              </p>
              <div className="pt-2.5 border-t border-[#0047AB]/15 flex items-start gap-2.5 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-gray-500">שעות פעילות:</span>
                  <HoursGrid branch={branch} dayClass="font-bold text-gray-800" hoursClass="font-black text-[#0047AB] text-left" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full bg-[#0047AB] hover:bg-[#003580] text-white font-extrabold text-base py-4 rounded-2xl shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>{branch.comingSoon ? 'עדכנו אותי כשהסניף נפתח' : `קביעת תור ${branch.inName}`}</span>
              </button>
              {branch.wazeUrl && (
                <a
                  href={branch.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold text-sm py-3 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-cyan-700" />
                  <span>ניווט ב-Waze</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              )}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <a
                  href={`tel:${branchPhone(branch)}`}
                  className="bg-[#FBFBFB] hover:bg-gray-100 p-3 rounded-xl border border-gray-200 font-bold text-gray-800 flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span dir="ltr">{branchPhone(branch)}</span>
                </a>
                <a
                  href={whatsappLink(branch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1DA851] text-white p-3 rounded-xl font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>וואטסאפ <span dir="ltr">{displayPhone(branchWhatsapp(branch))}</span></span>
                </a>
              </div>
            </div>
          </div>

          {hasPlace && (
            <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs min-h-[320px]">
              <iframe
                title={`מפה – האופטיקה החברתית ${branch.name}`}
                src={mapEmbedUrl(branch)}
                className="w-full h-full min-h-[320px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

        {/* The towns the branch serves — said in words, so a search from any of them finds this page */}
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-5 text-center space-y-3">
          <h3 className="font-black text-gray-900 font-['Rubik']">מגיעים אלינו לסניף {branch.name} מ:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {branch.nearby.map((t) => (
              <span key={t} className="bg-[#E8F0FE] text-[#0047AB] text-xs font-bold px-3 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            בדיקת ראייה ומשקפיים במחיר חברתי ל{branch.region} — {branch.distanceNote}.
          </p>
        </div>
      </div>
    </section>
  );
};
