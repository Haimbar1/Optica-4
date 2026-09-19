import React from 'react';
import { BUSINESS_INFO } from '../data/opticsData';
import { Glasses, MapPin, Phone, Navigation, HeartHandshake, Clock, ShieldCheck, Lock, FileText } from 'lucide-react';
import logoImg from '../assets/images/optics_logo_1786106308756.jpg';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src={logoImg}
                alt="האופטיקה הטובה"
                className="w-10 h-10 rounded-xl object-cover border border-emerald-800"
              />
              <span className="font-extrabold text-lg text-white font-['Rubik']">
                האופטיקה הטובה
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              מיזם אופטיקה חברתית במושב אמירים. בדיקות ראייה מקיפות, עדשות מולטיפוקל ומשקפיים מובחרים במחירים הוגנים ושפויים (150 - 250 ₪).
            </p>
          </div>

          {/* Business Address & Hours */}
          <div className="space-y-2.5 bg-slate-800/60 border border-slate-700/80 p-3.5 rounded-2xl">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>כתובת ושעות פעילות</span>
            </h4>
            <p className="text-white font-extrabold text-sm">{BUSINESS_INFO.address}</p>
            <p className="text-slate-400 text-xs">מושב אמירים, גליל עליון (חניה במקום)</p>
            
            <div className="pt-1 text-amber-300 font-black text-xs flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60">
              <Clock className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase">שעות פעילות:</span>
                <div className="grid grid-cols-[max-content_auto] items-center gap-x-2.5 gap-y-0.5 leading-tight">
                  <span className="text-slate-200 font-bold">ד', ה':</span>
                  <span dir="ltr" className="text-amber-300 font-black text-left">12:00-18:00</span>
                  <span className="text-slate-200 font-bold">ו':</span>
                  <span dir="ltr" className="text-amber-300 font-black text-left">10:00-14:00</span>
                </div>
              </div>
            </div>

            <a
              href={BUSINESS_INFO.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 hover:underline font-extrabold pt-1 text-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>פתח ניווט ב-Waze (וויז) ←</span>
            </a>
          </div>

          {/* Phones */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">📞 טלפונים לשירותכם</h4>
            <p className="text-slate-300">
              תורים לבדיקת ראייה (אביגיל): <a href={`tel:${BUSINESS_INFO.phoneAvigail}`} className="text-[#60A5FA] font-bold hover:underline">{BUSINESS_INFO.phoneAvigail}</a>
            </p>
            <p className="text-slate-300">
              פניות כלליות וביטולים (צביקה): <a href={`tel:${BUSINESS_INFO.phoneZvika}`} className="text-[#60A5FA] font-bold hover:underline">{BUSINESS_INFO.phoneZvika}</a>
            </p>
            <p className="text-slate-500 pt-1">הגעה בתיאום מראש בלבד</p>
          </div>

          {/* Data Security & Social Policy Notice */}
          <div className="space-y-3">
            <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl space-y-1.5">
              <h4 className="font-bold text-blue-300 flex items-center gap-1.5 text-xs">
                <HeartHandshake className="w-4 h-4 text-blue-300 shrink-0" />
                <span>התחייבות חברתית</span>
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                המיזם שלנו פועל ללא מתווכים ושכר דירה של קניונים, במטרה לתת לכם מוצר מצוין במחיר הטוב ביותר.
              </p>
            </div>

            {/* Security Assurance Badge */}
            <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>אבטחת מידע וסודיות מלאה</span>
              </div>
              <p className="text-[10.5px] text-emerald-200/80 leading-relaxed">
                כל פרטי הלקוחות, תוצאות בדיקות הראייה והיסטוריית הרכישות שמורים במערכת מאובטחת וחסויה.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} האופטיקה הטובה - מצפה מנחם 86, אמירים. כל הזכויות שמורות.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a href="#catalog" className="hover:text-slate-300 transition-colors">קטלוג משקפיים</a>
            <a href="#booking" className="hover:text-slate-300 transition-colors">בדיקת ראייה</a>
            <a href="#about" className="hover:text-slate-300 transition-colors">אודות</a>
            <a href="#faq" className="hover:text-slate-300 transition-colors">שאלות נפוצות</a>
            <span className="text-slate-700">|</span>
            <button
              id="footer-privacy-policy-link"
              onClick={onOpenPrivacy}
              className="text-slate-400 hover:text-blue-400 font-bold underline transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>מדיניות פרטיות ואבטחת מידע</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              id="footer-terms-link"
              onClick={onOpenTerms}
              className="text-slate-400 hover:text-blue-400 font-bold underline transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>תנאי שימוש ושירות</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

