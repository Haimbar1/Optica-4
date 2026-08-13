import React from 'react';
import { BUSINESS_INFO } from '../data/opticsData';
import { Glasses, MapPin, Phone, Navigation, HeartHandshake } from 'lucide-react';
import logoImg from '../assets/images/optics_logo_1786106308756.jpg';

export const Footer: React.FC = () => {
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

          {/* Business Address */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">📍 כתובת העסק</h4>
            <p className="text-slate-300 font-semibold">{BUSINESS_INFO.address}</p>
            <p className="text-slate-400">מושב אמירים, גליל עליון</p>
            <a
              href={BUSINESS_INFO.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#60A5FA] hover:underline font-bold pt-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>פתח ניווט בוויז (Waze)</span>
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

          {/* Social Policy Notice */}
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl space-y-2">
            <h4 className="font-bold text-blue-300 flex items-center gap-1.5 text-xs">
              <HeartHandshake className="w-4 h-4 text-blue-300" />
              <span>התחייבות חברתית</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              המיזם שלנו פועל ללא מתווכים ושכר דירה של קניונים, במטרה לתת לכם מוצר מצוין במחיר הטוב ביותר.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} האופטיקה הטובה - מצפה מנחם 86, אמירים. כל הזכויות שמורות.</p>
          <div className="flex gap-4">
            <a href="#catalog" className="hover:text-slate-300">קטלוג משקפיים</a>
            <a href="#booking" className="hover:text-slate-300">בדיקת ראייה</a>
            <a href="#about" className="hover:text-slate-300">אודות</a>
            <a href="#faq" className="hover:text-slate-300">שאלות נפוצות</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
