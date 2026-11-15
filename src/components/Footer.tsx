import React from 'react';
import { BRANCHES, BranchSlug, branchPath, branchPhone, ALL_BRANCH_NAMES, DEFAULT_BRANCH, telHref, whatsappLink, displayPhone, branchWhatsapp } from '../data/branches';
import { useBranch, HoursGrid } from '../branchContext';
import { bookingPageHref } from '../utils/calParams';
import { Glasses, MapPin, Phone, Navigation, HeartHandshake, Clock, ShieldCheck, Lock, FileText } from 'lucide-react';
import logoImg from '../assets/images/logo_optics.svg';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    label: 'אינסטגרם',
    href: 'https://www.instagram.com/hopticahatova/',
    hover: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-600 hover:to-purple-600',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z',
  },
  {
    name: 'Facebook',
    label: 'פייסבוק',
    href: 'https://www.facebook.com/profile.php?id=61561077188241',
    hover: 'hover:bg-[#1877F2]',
    path: 'M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07',
  },
];

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenBranch?: (slug: BranchSlug) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms, onOpenBranch }) => {
  const branch = useBranch();
  const phone = branchPhone(branch);
  // The home page has no branch: its phones are the main branch's (Amirim)
  const contact = branch || DEFAULT_BRANCH;
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src={logoImg}
                alt="האופטיקה החברתית"
                className="w-10 h-10 rounded-xl object-cover border border-emerald-800"
              />
              <span className="font-extrabold text-lg text-white font-['Rubik']">
                האופטיקה החברתית
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              מיזם אופטיקה חברתית ב{ALL_BRANCH_NAMES}. בדיקות ראייה מקיפות, עדשות מולטיפוקל ומשקפיים מובחרים במחירים הוגנים ושפויים (150 - 250 ₪).
            </p>
            {/* Social networks */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-slate-400 font-bold">עקבו אחרינו:</span>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`האופטיקה החברתית ב${s.label}`}
                  title={s.label}
                  className={`w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:border-transparent flex items-center justify-center transition-colors ${s.hover}`}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Business Address & Hours — the open branch's, or the list of branches */}
          {branch ? (
            <div className="space-y-2.5 bg-slate-800/60 border border-slate-700/80 p-3.5 rounded-2xl">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>סניף {branch.name} – כתובת ושעות</span>
              </h4>
              <p className="text-white font-extrabold text-sm">{branch.address || branch.name}</p>
              <p className="text-slate-400 text-xs">{branch.address ? branch.areaNote : 'הכתובת המדויקת תישלח עם אישור התור'}</p>
              <div className="pt-1 text-amber-300 font-black text-xs flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60">
                <Clock className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">שעות פעילות:</span>
                  <HoursGrid branch={branch} dayClass="text-slate-200 font-bold" hoursClass="text-amber-300 font-black text-left" />
                </div>
              </div>
              {branch.wazeUrl && (
                <a
                  href={branch.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 hover:underline font-extrabold pt-1 text-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>פתח ניווט ב-Waze (וויז) ←</span>
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-2 bg-slate-800/60 border border-slate-700/80 p-3.5 rounded-2xl">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>הסניפים שלנו</span>
              </h4>
              {BRANCHES.map((b) => (
                <a
                  key={b.slug}
                  href={branchPath(b)}
                  onClick={(e) => { if (onOpenBranch) { e.preventDefault(); onOpenBranch(b.slug); } }}
                  className="block bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60 hover:border-amber-400/60"
                >
                  <span className="block text-white font-extrabold text-sm">סניף {b.name}</span>
                  <span className="block text-slate-400 text-[11px]">{b.address || b.distanceNote}</span>
                </a>
              ))}
            </div>
          )}

          {/* Phones */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">📞 טלפונים לשירותכם</h4>
            <p className="text-slate-300">
              תורים לבדיקת ראייה: <a href={bookingPageHref()} className="text-[#60A5FA] font-bold hover:underline">קביעה ישר ביומן ←</a>
            </p>
            {contact.botPhone && (
              <p className="text-slate-300">
                קביעה או שינוי תור (נועה – מענה אוטומטי): <a href={telHref(contact.botPhone)} dir="ltr" className="text-[#60A5FA] font-bold hover:underline">{contact.botPhone}</a>
              </p>
            )}
            {contact.bookingContact && (
              <p className="text-slate-300">
                קביעת תור ({contact.bookingContact.name}): <a href={telHref(contact.bookingContact.phone)} dir="ltr" className="text-[#60A5FA] font-bold hover:underline">{contact.bookingContact.phone}</a>
              </p>
            )}
            <p className="text-slate-300">
              פניות כלליות וביטולים (חנות): <a href={`tel:${phone}`} dir="ltr" className="text-[#60A5FA] font-bold hover:underline">{phone}</a>
            </p>
            <p className="text-slate-300">
              וואטסאפ: <a href={whatsappLink(branch)} target="_blank" rel="noopener noreferrer" dir="ltr" className="text-[#4ADE80] font-bold hover:underline">{displayPhone(branchWhatsapp(branch))}</a>
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
          <p>© {new Date().getFullYear()} האופטיקה החברתית – {ALL_BRANCH_NAMES}. כל הזכויות שמורות.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a href="#catalog" className="hover:text-slate-300 transition-colors">קטלוג משקפיים</a>
            <a href="#booking" className="hover:text-slate-300 transition-colors">בדיקת ראייה</a>
            <a href="#about" className="hover:text-slate-300 transition-colors">אודות</a>
            <a href="#faq" className="hover:text-slate-300 transition-colors">שאלות נפוצות</a>
            <span className="text-slate-700">|</span>
            {/* Real /privacy and /terms URLs (Facebook's review looks for them); a click opens the pop-up instead */}
            <a
              id="footer-privacy-policy-link"
              href="/privacy"
              onClick={(e) => { if (onOpenPrivacy) { e.preventDefault(); onOpenPrivacy(); } }}
              className="text-slate-400 hover:text-blue-400 font-bold underline transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>מדיניות פרטיות ואבטחת מידע</span>
            </a>
            <span className="text-slate-700">|</span>
            <a
              id="footer-terms-link"
              href="/terms"
              onClick={(e) => { if (onOpenTerms) { e.preventDefault(); onOpenTerms(); } }}
              className="text-slate-400 hover:text-blue-400 font-bold underline transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>תנאי שימוש ושירות</span>
            </a>
            <span className="text-slate-700">|</span>
            <a href="https://portal.smartesek.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-400 transition-colors">
              ניהול
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

