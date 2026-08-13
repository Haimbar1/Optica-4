import React from 'react';
import { HeartHandshake, ShieldCheck, DollarSign, Store, Award, Users, CheckCircle2, TrendingDown, Eye } from 'lucide-react';

export const AboutSocialOptics: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-[#F8F9FA] text-[#1A1A1A] relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#0047AB] text-xs font-bold">
            <HeartHandshake className="w-4 h-4 text-[#0047AB]" />
            <span>הסיפור של האופטיקה החברתית</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 font-['Rubik'] tracking-tight">
            למה לשלם אלפי שקלים על משקפיים?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            הרעיון מאחורי "האופטיקה הטובה" פשוט: איכות וסטייל ללא פשרות, במחירים שפויים והוגנים לכולם.
          </p>
        </div>

        {/* Comparison Grid: Mall Chains vs HaOptika HaTova */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Mall Chains Card */}
          <div className="bg-white border-2 border-rose-100 rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-xs">
            <div className="absolute top-0 left-0 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-br-2xl">
              רשתות הקניונים הגדולות
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 font-['Rubik']">תמחור ברשתות המסורתיות</h3>
                <span className="text-xs text-rose-600 font-bold">1,000 ₪ - 3,500 ₪ למשקפיים</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              ברשתות הגדולות אתם לא משלמים רק על משקפיים - אתם משלמים על המותג שעל השלט, על שכר הדירה המטורף בקניון, ועל צוות עצום של עובדים ומנהלים.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-gray-600 pt-2 border-t border-gray-100">
              <li className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>שכר דירה יקר במיקומי פרימיום בקניונים</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>תקציבי פרסום ושיווק מנופחים במיליונים</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>תג מחיר גבוה ללא קשר לעלויות הייצור בפועל</span>
              </li>
            </ul>
          </div>

          {/* HaOptika HaTova Social Model Card */}
          <div className="bg-white border-2 border-[#0047AB] rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-md">
            <div className="absolute top-0 left-0 bg-[#0047AB] text-white text-xs font-black px-3 py-1 rounded-br-2xl">
              המודל של האופטיקה הטובה
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] text-[#0047AB] flex items-center justify-center font-bold">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 font-['Rubik']">אצלנו זה אחרת!</h3>
                <span className="text-xs text-[#0047AB] font-extrabold">150 ₪ / 250 ₪ למסגרת + עדשות!</span>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              צוות קטן ויעיל, חלל עסקי בעלות נמוכה באמירים, ותמחור שמאפשר לנו להתקיים בכבוד - בלי להעמיס עליכם. גם מותגים בינלאומיים נמכרים במחירים שפויים.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-gray-800 pt-2 border-t border-gray-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0047AB] shrink-0" />
                <span>מסגרת כולל עדשות ראייה וציפויים אנטי-רפלקס</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0047AB] shrink-0" />
                <span>בדיקות ראייה מקיפות ויסודיות ע"י אופטומטריסט מוסמך</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0047AB] shrink-0" />
                <span>התאמה אישית וכיוונון מקצועי בעת האיסוף</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid sm:grid-cols-3 gap-6 pt-4">
          <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] text-[#0047AB] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-gray-900">איכות ללא פשרות</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              טיטניום, אולטם, פלסטיק איכותי ומתכות עמידות. עדשות עם הציפויים המתקדמים ביותר.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] text-[#0047AB] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-gray-900">יחס אישי וחם</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              בלי לחץ של קניון הומה. מקבלים אתכם בסבלנות, מקשיבים לצורך האמיתי ומתאימים בדיוק.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] text-[#0047AB] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-gray-900">אחריות ושקיפות מלאה</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              אחריות על המסגרות והעדשות, ליווי צמוד לאורך תהליך ההסתגלות, ובמיוחד במולטיפוקל.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
