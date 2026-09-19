import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2, Eye, ShoppingBag, UserCheck, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/opticsData';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div
      id="legal-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="legal-modal-container"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0047AB] to-[#0A2540] text-white p-5 sm:p-6 flex items-center justify-between gap-4 border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-['Rubik'] leading-tight">
                מדיניות פרטיות, אבטחת מידע ותנאי שימוש
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">
                האופטיקה הטובה • מצפה מנחם 86, אמירים
              </p>
            </div>
          </div>
          <button
            id="close-legal-modal-button"
            onClick={onClose}
            aria-label="סגור חלון"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 sm:px-6 pt-3 gap-2">
          <button
            id="privacy-policy-tab-btn"
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-4 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-[#0047AB] text-[#0047AB] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-[#0047AB]" />
            <span>מדיניות פרטיות ואבטחת מידע</span>
          </button>
          <button
            id="terms-of-service-tab-btn"
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-4 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'terms'
                ? 'border-[#0047AB] text-[#0047AB] bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-[#0047AB]" />
            <span>תנאי שימוש ושירות</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
          {activeTab === 'privacy' ? (
            <div className="space-y-6">
              {/* Highlight Box */}
              <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-[#0047AB]">
                <ShieldCheck className="w-6 h-6 text-[#0047AB] shrink-0 mt-1" />
                <div>
                  <h3 className="font-black text-base sm:text-lg mb-1">
                    המחויבות המוחלטת שלנו לפרטיותכם ולאבטחת הנתונים
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-normal">
                    ב״האופטיקה הטובה אמירים״ אנו מתייחסים לפרטיותכם, לפרטיכם האישיים ולמידע הרפואי-אופטומטרי שלכם בחרדת קודש. כל המידע נשמר בסודיות מלאה, במערכות מאובטחות ובהתאם לחוק הגנת הפרטיות הישראלי.
                  </p>
                </div>
              </div>

              {/* Section 1: Customer Details Security */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base sm:text-lg">
                  <UserCheck className="w-5 h-5 text-[#0047AB]" />
                  <h4>1. שמירה מאובטחת של פרטי לקוחות</h4>
                </div>
                <p className="text-slate-600 text-sm sm:text-base">
                  פרטי ההתקשרות שלכם (כגון שם מלא, מספר טלפון, כתובת מגורים ודואר אלקטרוני) נאספים אך ורק לצורך מתן השירות, תיאום תורים, עדכון על מוכנות המשקפיים ושירות לקוחות אישי.
                </p>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 pr-2">
                  <li>הפרטים נשמרים במאגר מידע מאובטח ומוגן בסיסמאות ובהצפנה.</li>
                  <li><strong>איסור מוחלט על העברת מידע:</strong> אנו מתחייבים לעולם לא למכור, להשכיר, להעביר או לחלוק את פרטיכם האישיים עם אף גורם צד שלישי או חברות פרסום.</li>
                </ul>
              </div>

              {/* Section 2: Exam & Prescription Security */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base sm:text-lg">
                  <Eye className="w-5 h-5 text-[#0047AB]" />
                  <h4>2. שמירת תוצאות בדיקות ראייה ומרשמים (חיסיון מלא)</h4>
                </div>
                <p className="text-slate-600 text-sm sm:text-base">
                  תוצאות בדיקות הראייה, מרשמי האופטומטריסט המוסמך (מספרי ראייה, צילינדרים, ציר, PD, נתוני מולטיפוקל וסוגי ציפויים) מתועדים לצורך מעקב רציף והבטחת איכות הראייה שלכם לאורך זמן:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>סודיות רפואית:</strong> כל תוצאת בדיקה חסויה לחלוטין ונגישה אך ורק לצוות המקצועי המורשה.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>זמינות למטופל:</strong> כל לקוח זכאי לקבל בכל עת עותק מלא ומדויק של מרשם הבדיקה שלו ללא עלות.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>שמירה היסטורית:</strong> היסטוריית המרשמים נשמרת כדי שנוכל להשוות שינויים בראייה בביקורים הבאים.</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Purchases & Warranty */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base sm:text-lg">
                  <ShoppingBag className="w-5 h-5 text-[#0047AB]" />
                  <h4>3. תיעוד רכישות, תשלומים ואחריות</h4>
                </div>
                <p className="text-slate-600 text-sm sm:text-base">
                  כל רכישה שבוצעה בחנות מתועדת באופן מסודר הכולל את דגם המסגרת, סוג העדשות, הציפויים ותאריך הרכישה:
                </p>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 pr-2">
                  <li>התיעוד מאפשר לנו להעניק אחריות מלאה, שירות תיקונים והתאמות גם שנים לאחר הרכישה.</li>
                  <li>פרטי תשלום ואמצעי תשלום מעובדים אך ורק באמצעות מסופי סליקה מורשים בתקן האבטחה המחמיר ביותר (PCI-DSS) ואינם נשמרים במערכות המקומיות שלנו.</li>
                </ul>
              </div>

              {/* Section 4: Security Protocols */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base sm:text-lg">
                  <Lock className="w-5 h-5 text-[#0047AB]" />
                  <h4>4. אמצעי אבטחה פיזיים ודיגיטליים</h4>
                </div>
                <p className="text-slate-600 text-sm sm:text-base">
                  אנו מיישמים אמצעי אבטחת מידע מתקדמים הכוללים בקרות גישה מחמירות, הצפנת נתונים וגיבויים תקופתיים מאובטחים למניעת גישה בלתי מורשית, שינוי או אובדן נתונים.
                </p>
              </div>

              {/* Contact for Privacy Questions */}
              <div className="pt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-600">
                <p>
                  לשאלות בנושא פרטיות או לבקשת עדכון/עיון בנתוניכם, ניתן לפנות לצביקה בטלפון{' '}
                  <a href={`tel:${BUSINESS_INFO.phoneZvika}`} className="text-[#0047AB] font-bold hover:underline">
                    {BUSINESS_INFO.phoneZvika}
                  </a>{' '}
                  או במייל <a href="mailto:info@good-optics.co.il" className="text-[#0047AB] font-bold hover:underline">info@good-optics.co.il</a>.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Terms Section 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base sm:text-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#0047AB]" />
                  <h4>1. מהות המיזם ותנאי השירות</h4>
                </div>
                <p className="text-slate-600 text-sm sm:text-base">
                  ״האופטיקה הטובה״ הינה מיזם אופטיקה חברתית השוכן במצפה מנחם 86, מושב אמירים. מטרתנו היא לספק משקפיים איכותיים ומוקפדים במחירים הוגנים ושפויים (150 ₪ עד 250 ₪ עבור מסגרת מלאה ועדשות איכותיות כולל ציפויים).
                </p>
              </div>

              {/* Terms Section 2: Appointments */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base sm:text-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#0047AB]" />
                  <h4>2. תיאום תורים והגעה</h4>
                </div>
                <p className="text-slate-600 text-sm sm:text-base">
                  בדיקות הראייה וההגעה לחנות מתקיימות בימים ד' ו-ה' (12:00-18:00) וביום ו' (10:00-14:00) <strong>בתיאום מראש בלבד</strong> כדי להבטיח יחס אישי והימנעות מעומסים.
                </p>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 pr-2">
                  <li>תיאום בדיקות ראייה (אביגיל, מתאמת תורים): <a href={`tel:${BUSINESS_INFO.phoneAvigail}`} className="text-[#0047AB] font-bold">{BUSINESS_INFO.phoneAvigail}</a></li>
                  <li>בירורים ושינוי מועד מול צביקה: <a href={`tel:${BUSINESS_INFO.phoneZvika}`} className="text-[#0047AB] font-bold">{BUSINESS_INFO.phoneZvika}</a></li>
                </ul>
              </div>

              {/* Terms Section 3: Warranty & Service */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base sm:text-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#0047AB]" />
                  <h4>3. אחריות על מסגרות ועדשות</h4>
                </div>
                <p className="text-slate-600 text-sm sm:text-base">
                  אנו עומדים באופן מלא מאחורי איכות המוצרים שלנו:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs sm:text-sm text-slate-700">
                  <p>• <strong>אחריות על התאמה אופטית:</strong> התאמה מלאה למרשם שנבדק.</p>
                  <p>• <strong>אחריות על מסגרות:</strong> אחריות כנגד פגמי ייצור בחומרים (פלסטיק, מתכת, טיטניום, אולטם).</p>
                  <p>• <strong>שירות ותיקונים:</strong> כיוונון מסגרות, החלפת אפונים וברגים מתבצעים בשמחה וברוחב לב.</p>
                </div>
              </div>

              {/* Terms Section 4: Site Usage */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base sm:text-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#0047AB]" />
                  <h4>4. שימוש באתר האינטרנט</h4>
                </div>
                <p className="text-slate-600 text-sm sm:text-base">
                  המידע באתר מוצג לשירות הציבור. קטלוג המשקפיים, שעות הפעילות והמחירים מעודכנים באופן שוטף. ניתן להשתמש בכלי המדידה הווירטואלי (מצלמה) בכפוף לאישור הגישה המקומית במכשירכם בלבד — שום תמונה אינה מועלית לשרתים חיצוניים.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>המידע האישי, בדיקות הראייה והרכישות שלכם מוגנים ומאובטחים.</span>
          </div>
          <button
            id="close-legal-modal-bottom-btn"
            onClick={onClose}
            className="px-5 py-2 bg-[#0047AB] hover:bg-blue-800 text-white rounded-xl font-bold text-sm transition-colors shadow-xs"
          >
            הבנתי וסגור
          </button>
        </div>
      </div>
    </div>
  );
};
