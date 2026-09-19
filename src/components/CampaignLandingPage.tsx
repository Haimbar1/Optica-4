import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  Glasses,
  MessageCircle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  HeartHandshake,
  Star,
  Users,
  Award,
  AlertCircle
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/opticsData';
import { getNextWednesdayDate, formatHebrewDate } from '../utils/dateUtils';
import campaignGlassesImg from '../assets/images/campaign_glasses_1789850551440.jpg';
import logoImg from '../assets/images/logo_optics.svg';

interface CampaignLandingPageProps {
  onBackToMain?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const CampaignLandingPage: React.FC<CampaignLandingPageProps> = ({
  onBackToMain,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [selectedWednesday, setSelectedWednesday] = useState<string>('2026-09-23');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const computedDate = getNextWednesdayDate();
    setSelectedWednesday(computedDate);
  }, []);

  const calUrl = `https://cal.com/haoptika-hatova/30min?date=${selectedWednesday}`;
  const calEmbedUrl = `https://cal.com/haoptika-hatova/30min?date=${selectedWednesday}&embed=true`;

  const scrollToBooking = () => {
    const el = document.getElementById('booking-calendar-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const triggerChatBot = () => {
    // Trigger the SmartEsek chat widget
    const fab = document.getElementById('obw-fab') || document.querySelector('.obw-fab-button');
    if (fab) {
      (fab as HTMLElement).click();
    } else {
      // Fallback to WhatsApp
      window.open(BUSINESS_INFO.whatsappDirectAvigail, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Assistant',sans-serif] selection:bg-[#62B83E] selection:text-white" dir="rtl">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-[#0047AB] via-[#0A2540] to-[#0047AB] text-white py-2.5 px-4 text-xs sm:text-sm font-semibold shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#62B83E] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
              מבצע קמפיין פייסבוק מיוחד
            </span>
            <span className="text-blue-100 font-medium hidden sm:inline">
              משקפיים שלמים (מסגרת + עדשות) ב-150 ₪ בלבד!
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <a
              href={`tel:${BUSINESS_INFO.phoneAvigail}`}
              className="flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>תורים ובירורים: {BUSINESS_INFO.phoneAvigail}</span>
            </a>
            {onBackToMain && (
              <button
                id="back-to-main-site-btn"
                onClick={onBackToMain}
                className="inline-flex items-center gap-1 text-blue-200 hover:text-white underline underline-offset-4 cursor-pointer text-xs"
              >
                <span>לאתר המלא</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={onBackToMain}
            className="flex items-center gap-3 cursor-pointer group"
            title="האופטיקה הטובה - אופטיקה חברתית"
          >
            <img
              src={logoImg}
              alt="האופטיקה הטובה"
              className="w-12 h-12 rounded-xl object-contain shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-[#0047AB] font-['Rubik'] leading-none">
                  האופטיקה הטובה
                </span>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  אופטיקה חברתית
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">
                מצפה מנחם 86, אמירים • 15 ק"מ מכרמיאל
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="header-chat-btn"
              onClick={triggerChatBot}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>שאלות בצ'אט</span>
            </button>

            <button
              id="header-book-btn"
              onClick={scrollToBooking}
              className="inline-flex items-center gap-2 bg-[#0047AB] hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>קביעת תור ביומן</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Campaign Hero Section (Ad Continuation) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F8ED] via-white to-slate-50 pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Right Column: High-Impact Ad Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-right">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#EDF7E5] border border-[#B7E2A0] text-[#3D861D] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-2xs">
                <HeartHandshake className="w-4 h-4 text-[#4C9C29] shrink-0" />
                <span>מיזם חברתי ללא מטרות רווח מנופח • לכל תושבי הצפון והגליל</span>
              </div>

              {/* Main Headline (Direct match with Facebook ad) */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 font-['Rubik'] leading-[1.15] tracking-tight">
                  תרמנו לחיילים –
                  <span className="block text-[#0047AB] mt-1">
                    עכשיו מגיע לכולם!
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-700 font-bold leading-snug">
                  משקפי ראייה מלאים איכותיים ב-<span className="text-[#0047AB] font-black text-2xl">150 ₪</span> בלבד
                  <span className="text-emerald-700 block sm:inline"> + בדיקת ראייה מקיפה בחינם!</span>
                </p>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                בלי פערי תיווך של רשתות ענק, בלי שכר דירה של קניונים ובלי טריקים. 
                מגיעים לאמירים, עוברים בדיקת ראייה מקצועית ע"י אופטומטריסטית מורשית, בוחרים מסגרת יפהפייה ויוצאים עם משקפיים במחיר שפוי והוגן.
              </p>

              {/* Badges Bar (Visual echo of the Facebook creative) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 text-center shadow-2xs">
                  <div className="text-emerald-800 font-black text-lg sm:text-xl leading-none">חינם!</div>
                  <div className="text-xs font-bold text-emerald-950 mt-1">בדיקת ראייה מקצועית</div>
                </div>

                <div className="bg-blue-50 border-2 border-[#0047AB]/30 rounded-2xl p-3 text-center shadow-2xs">
                  <div className="text-[#0047AB] font-black text-lg sm:text-xl leading-none">150 ₪ בלבד</div>
                  <div className="text-xs font-bold text-blue-950 mt-1">מסגרת מלאה + עדשות</div>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-center shadow-2xs flex sm:flex-col items-center justify-center gap-1">
                  <div className="text-amber-900 font-black text-sm sm:text-base leading-none">כולל ציפויים</div>
                  <div className="text-xs font-bold text-amber-950">אנטי-רפלקס + נגד שריטות</div>
                </div>
              </div>

              {/* Immediate Primary CTA Button */}
              <div className="pt-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <button
                  id="hero-book-now-button"
                  onClick={scrollToBooking}
                  className="inline-flex items-center justify-center gap-3 bg-[#62B83E] hover:bg-[#529e32] text-white text-base sm:text-lg font-black px-7 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-white" />
                  <span>שריינו תור ביומן עכשיו (ללא תשלום)</span>
                </button>

                <button
                  id="hero-chat-question-button"
                  onClick={triggerChatBot}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 text-sm font-bold px-5 py-4 rounded-2xl transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-[#0047AB]" />
                  <span>יש לי שאלה בצ'אט</span>
                </button>
              </div>

              {/* Hours notice banner directly in hero */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3 text-xs sm:text-sm">
                <Clock className="w-5 h-5 text-[#0047AB] shrink-0" />
                <div className="text-slate-700">
                  <strong className="text-slate-900 block sm:inline">שעות פעילות לבדיקות: </strong>
                  <span>ימים ד', ה': 12:00-18:00 | יום ו': 10:00-14:00 (בתיאום מראש בלבד)</span>
                </div>
              </div>
            </div>

            {/* Left Column: Visual Ad Card (Exact Facebook campaign mood) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <img
                  src={campaignGlassesImg}
                  alt="משקפיים איכותיים ב-150 שקלים - האופטיקה הטובה אמירים"
                  className="w-full h-auto object-cover max-h-[460px]"
                />

                {/* Overlay Floating Badges Echoing the Facebook Graphic */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs p-2 rounded-2xl shadow-lg border border-emerald-200 flex items-center gap-2">
                  <img src={logoImg} alt="לוגו" className="w-8 h-8 rounded-lg object-contain" />
                  <div className="text-right">
                    <span className="font-black text-xs text-[#0047AB] block leading-tight">האופטיקה הטובה</span>
                    <span className="text-[10px] text-emerald-700 font-extrabold block">אופטיקה חברתית</span>
                  </div>
                </div>

                {/* 150 NIS Circle Badge */}
                <div className="absolute bottom-16 left-4 bg-[#0047AB] text-white w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center p-2 shadow-2xl border-4 border-white text-center transform -rotate-6">
                  <span className="text-[10px] sm:text-xs font-bold leading-tight">מסגרת + עדשות</span>
                  <span className="text-xl sm:text-2xl font-black leading-none my-0.5">₪150</span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-amber-300">בלבד!</span>
                </div>

                {/* Free Eye Exam Badge */}
                <div className="absolute bottom-16 right-4 bg-[#62B83E] text-white w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center p-2 shadow-xl border-3 border-white text-center transform rotate-6">
                  <span className="text-xs sm:text-sm font-black leading-tight">בדיקת ראייה</span>
                  <span className="text-xs sm:text-sm font-extrabold text-yellow-100">בחינם</span>
                </div>

                {/* Bottom Bar matching the ad footer */}
                <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-xs py-2 px-3 text-center border-t border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="text-[#0047AB]">משקפיים מחוברים חברתית - זכאות לכל כיס!</span>
                  <span className="text-slate-600 flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3 h-3 text-red-500" />
                    <span>אמירים (15 ק"מ מכרמיאל)</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Package Breakdown: What is in the 150 ₪ Deal */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[#0047AB] font-black text-xs tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full">
              שקיפות מלאה ללא אותיות קטנות
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Rubik']">
              מה בדיוק כוללת חבילת ה-150 ₪ שלנו?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              אין שום התחייבות, אין הפתעות בקופה, ואין שום צורך לשלם 1,000 ש"ח ברשתות.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-[#62B83E] transition-colors shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <Glasses className="w-6 h-6 text-[#4C9C29]" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">1. מסגרת מעוצבת ואיכותית</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                מבחר גדול של מאות מסגרות לבחירה – פלסטיק איכותי, מתכת, מסגרות קלאסיות ומודרניות לגברים, נשים וילדים.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-[#0047AB] transition-colors shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0047AB] flex items-center justify-center font-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">2. עדשות אופטיות עם ציפויים</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                עדשות אופטיות מדויקות כולל ציפוי אנטי-רפלקס (מונע סנוור בנהיגה ומסכים) וציפוי הגנה מפני שריטות.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-amber-400 transition-colors shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                <Award className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">3. בדיקת ראייה ללא עלות</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                בדיקה מקיפה וסבלנית בציוד אופטומטרי מתקדם ע"י אופטומטריסטית מורשית בעלת ניסיון רב (אביגיל).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-purple-400 transition-colors shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">4. נרתיק, מטלית ואחריות</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                כל זוג מגיע עם נרתיק קשיח ומטלית מיקרופייבר, התאמה וכיוונון אישיים למבנה הפנים ואחריות מלאה.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CTA SECTION: Embedded Cal.com Calendar */}
      <section id="booking-calendar-section" className="py-14 bg-gradient-to-b from-slate-50 via-[#F3F8EE] to-white scroll-mt-20 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          {/* Main Booking Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#62B83E] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-xs">
              <Calendar className="w-4 h-4 text-white" />
              <span>שלב 1: בחירת יום ושעה ביומן המקוון</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 font-['Rubik']">
              קביעת תור מהירה – שריינו את מקומכם
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              הבדיקות וההגעה מתקיימות <strong>בתיאום מראש בלבד</strong> כדי להעניק לכם יחס אישי וללא המתנה בתור.
            </p>
          </div>

          {/* CRUCIAL REQUIREMENT: Explicit days & hours heading explanation */}
          <div className="bg-white border-2 border-[#0047AB] rounded-3xl p-5 sm:p-7 shadow-lg mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0047AB] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Clock className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 font-['Rubik']">
                    שעות פעילות וימים שניתן לבחור ביומן:
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    נא לבחור ביומן למטה יום רביעי, חמישי או שישי בלבד:
                  </p>
                </div>
              </div>

              {/* Quick Link Button to Cal */}
              <a
                href={calUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0"
              >
                <span>פתיחת היומן במסך מלא</span>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            </div>

            {/* Days Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Wed & Thu */}
              <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#0047AB]"></span>
                    <span className="font-black text-base sm:text-lg text-slate-950">ימים ד', ה' (רביעי וחמישי)</span>
                  </div>
                  <div className="text-xs text-slate-600">שעות פעילות לבדיקות והתאמה</div>
                </div>
                <div className="bg-[#0047AB] text-white px-4 py-2 rounded-xl text-center shadow-xs shrink-0">
                  <span dir="ltr" className="font-black text-base sm:text-lg text-amber-300 tracking-wide block">
                    12:00 - 18:00
                  </span>
                </div>
              </div>

              {/* Fri */}
              <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#62B83E]"></span>
                    <span className="font-black text-base sm:text-lg text-slate-950">יום ו' (שישי)</span>
                  </div>
                  <div className="text-xs text-slate-600">שעות פעילות ערב שבת</div>
                </div>
                <div className="bg-[#4C9C29] text-white px-4 py-2 rounded-xl text-center shadow-xs shrink-0">
                  <span dir="ltr" className="font-black text-base sm:text-lg text-white tracking-wide block">
                    10:00 - 14:00
                  </span>
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                💡 <strong>טיפ:</strong> היומן נפתח אוטומטית על יום רביעי הקרוב ({selectedWednesday}). ניתן לדפדף לתאריכים נוספים בימי רביעי, חמישי ושישי.
              </span>
            </div>
          </div>

          {/* Embedded Cal.com Calendar Card */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden relative">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-bold">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>יומן קביעת תורים ישיר - האופטיקה הטובה (30 דקות בדיקה והתאמה)</span>
              </div>
              <span className="text-slate-400 hidden sm:inline text-xs">
                אישור מיידי במייל וב-SMS
              </span>
            </div>

            {/* Cal.com Iframe container */}
            <div className="relative w-full bg-white min-h-[680px]">
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50 z-10">
                  <div className="w-10 h-10 border-4 border-[#0047AB] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-bold text-slate-800 text-sm">טוען את לוח הזמנים של האופטיקה...</p>
                  <p className="text-xs text-slate-500 mt-1">תוכלו לבחור יום ושעה שנוחים לכם</p>
                </div>
              )}

              <iframe
                id="cal-com-embedded-iframe"
                src={calEmbedUrl}
                title="קביעת תור ביומן Cal.com"
                className="w-full h-[700px] border-0"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>

            {/* Assistance footer below calendar */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="text-slate-600 text-center sm:text-right">
                <span>מסתבכים עם היומן המקוון? אפשר לקבוע גם בוואטסאפ או בשיחה ישירה:</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${BUSINESS_INFO.phoneAvigail}`}
                  className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-xl font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>אביגיל: {BUSINESS_INFO.phoneAvigail}</span>
                </a>
                <button
                  id="chat-help-booking-btn"
                  onClick={triggerChatBot}
                  className="inline-flex items-center gap-1.5 text-[#0047AB] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>עזרה בצ'אט</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Location & Navigation Section (Waze link as specified) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-slate-900 via-[#0A2540] to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            {/* Background decorative glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#0047AB]/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#62B83E]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4 text-right">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>הגעה פשוטה ונוחה בלב הגליל</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-['Rubik'] text-white">
                  איך מגיעים אלינו?
                </h3>

                <div className="space-y-2 text-slate-200 text-sm sm:text-base leading-relaxed">
                  <p className="font-extrabold text-white text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-400 shrink-0" />
                    <span>מצפה מנחם 86, אמירים. 15 ק"מ מכרמיאל לכיוון צפת.</span>
                  </p>
                  <p className="text-slate-300">
                    החנות ממוקמת באווירה גלילית ירוקה ושלווה, 15 דקות בלבד נסיעה מכרמיאל ו-20 דקות מצפת. חניה חופשית ובחינם ממש בפתח המקום.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    id="waze-navigation-btn"
                    href={BUSINESS_INFO.wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-cyan-500/30 transition-all cursor-pointer text-sm sm:text-base"
                  >
                    <Navigation className="w-5 h-5 fill-current" />
                    <span>לחצו לניווט ישיר ב-Waze</span>
                  </a>

                  <a
                    href="https://maps.google.com/?q=32.936389,35.454517"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-3.5 rounded-2xl transition-colors text-sm"
                  >
                    <MapPin className="w-4 h-4 text-emerald-300" />
                    <span>Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Coordinates and visual map card */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 border-b border-white/10 pb-2">
                  <span>נקודת ציון:</span>
                  <span dir="ltr" className="font-mono text-amber-300 font-bold">32.936389, 35.454517</span>
                </div>
                <div className="space-y-2 text-xs text-slate-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>הוראות הגעה מדויקות: נכנסים לשער מושב אמירים, וממשיכים ישר לפי השילוט למצפה מנחם 86.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>בכל שאלה בדרך צביקה זמין ללוות אתכם טלפונית: {BUSINESS_INFO.phoneZvika}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="bg-slate-950/60 rounded-xl p-3 text-center">
                    <span className="text-[11px] text-slate-400 block">מרחקי הגעה לדוגמה:</span>
                    <div className="flex items-center justify-around text-xs font-bold text-white pt-1">
                      <span>כרמיאל: 15 דק'</span>
                      <span>•</span>
                      <span>צפת: 20 דק'</span>
                      <span>•</span>
                      <span>מירון: 10 דק'</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Social Proof & Reviews */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Rubik']">
              מה אומרים הלקוחות שהגיעו אלינו?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              מאות לקוחות מכרמיאל, צפת, הגליל והמרכז כבר עברו לאופטיקה חברתית
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "הייתי סקפטי לגבי מחיר של 150 ש״ח למשקפיים מלאים. הגעתי לאמירים, אביגיל בדקה אותי בסבלנות מדהימה ובחרתי מסגרת מהממת. לא שילמתי שקל יותר. ממליץ בחום לכולם!"
              </p>
              <div className="text-xs font-bold text-slate-900 border-t border-slate-100 pt-2">
                — דניאל ק., כרמיאל
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "מיזם מבורך ומרגש. קניתי כבר 3 זוגות – אחד לראייה, אחד לקריאה ואחד משקפי שמש אופטיות. האיכות מצוינת והשירות של צביקה ואביגיל זה חוויה אחרת לגמרי."
              </p>
              <div className="text-xs font-bold text-slate-900 border-t border-slate-100 pt-2">
                — רחל מ., צפת
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "שמעתי עליהם מהתרומות לחיילים במלחמה והחלטתי להגיע. אין מילים לתאר את ההוגנות והמקצועיות. חסכתי מעל 800 שקלים בהשוואה לרשת בקניון!"
              </p>
              <div className="text-xs font-bold text-slate-900 border-t border-slate-100 pt-2">
                — איתי ש., גליל עליון
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Rubik']">
              שאלות נפוצות על המבצע
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              כל מה שחשוב לדעת לפני שמגיעים
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'האם המחיר של 150 ₪ באמת כולל גם מסגרת וגם עדשות?',
                a: 'חד משמעית כן! החבילה כוללת מסגרת מלאה לבחירה מתוך המגוון המשתתף במבצע + זוג עדשות אופטיות איכותיות כולל ציפוי אנטי-רפלקס ונגד שריטות + בדיקת ראייה ללא עלות.',
              },
              {
                q: 'באילו ימים ושעות אפשר להגיע לבדיקה?',
                a: 'שעות הפעילות הן: ימים ד\' ו-ה\' בין 12:00 ל-18:00, ויום ו\' בין 10:00 ל-14:00. ההגעה הינה בתיאום מראש בלבד דרך היומן או הטלפון.',
              },
              {
                q: 'האם אפשר להביא מרשם מוכן מבדיקה קודמת?',
                a: 'בהחלט! אם יש לכם מרשם עדכני מרופא עיניים או אופטומטריסט שאתם מרוצים ממנו, אפשר להביא אותו ונכין לפיו בדיוק. כמובן שניתן גם לעבור אצלנו בדיקה מלאה בחינם.',
              },
              {
                q: 'מה קורה אם יש לי צילינדר גבוה או מספר מעל 4?',
                a: 'חבילת הבסיס ב-150 ₪ מכסה את רוב המרשמים הסטנדרטיים (עד מספר 4 וצילינדר עד 2). עבור מרשמים מיוחדים, עדשות דקות במיוחד (אינדקס 1.67/1.74) או מולטיפוקל, ישנה תוספת מחיר הוגנת ושקופה שמוסברת במלואה מראש – עדיין בשבריר ממחירי השוק!',
              },
              {
                q: 'תוך כמה זמן המשקפיים מוכנים?',
                a: 'מרשמים עם עדשות במלאי מוכנים בדרך כלל תוך ימים ספורים בלבד. עדשות מיוחדות או מולטיפוקל מוכנות תוך 7-10 ימי עסקים.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-right p-4 font-bold text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors text-sm sm:text-base cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0047AB] shrink-0 transition-transform duration-200 ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Sticky Assistant Prompt */}
      <div className="bg-[#0047AB] text-white py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="space-y-1">
            <h4 className="font-black text-lg sm:text-xl font-['Rubik'] text-white">
              מוכנים לראות צלול במחיר הגון?
            </h4>
            <p className="text-xs sm:text-sm text-blue-100">
              שריינו תור עכשיו ביומן או לחצו לפתיחת הצ'אט לקבלת מענה אישי ומהיר.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToBooking}
              className="bg-[#62B83E] hover:bg-[#529e32] text-white font-black text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
            >
              קביעת תור ביומן
            </button>
            <button
              onClick={triggerChatBot}
              className="bg-white/20 hover:bg-white/30 text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-amber-300" />
              <span>עזרה בצ'אט</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4 text-center sm:text-right">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="האופטיקה הטובה" className="w-8 h-8 rounded-lg object-contain" />
              <div>
                <span className="font-bold text-white block">האופטיקה הטובה - אופטיקה חברתית</span>
                <span className="text-[11px] text-slate-500">מצפה מנחם 86, אמירים • 15 ק"מ מכרמיאל</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              {onBackToMain && (
                <button onClick={onBackToMain} className="hover:text-white transition-colors cursor-pointer">
                  לאתר הראשי
                </button>
              )}
              {onOpenPrivacy && (
                <button onClick={onOpenPrivacy} className="hover:text-blue-400 transition-colors cursor-pointer">
                  מדיניות פרטיות ואבטחת מידע
                </button>
              )}
              {onOpenTerms && (
                <button onClick={onOpenTerms} className="hover:text-blue-400 transition-colors cursor-pointer">
                  תנאי שימוש
                </button>
              )}
              <a href={BUSINESS_INFO.wazeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">
                ניווט ב-Waze
              </a>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
            <p>© {new Date().getFullYear()} האופטיקה הטובה. כל הזכויות שמורות.</p>
            <p className="text-emerald-400/80">🔒 המידע האישי, תוצאות הבדיקות והרכישות שמורים במערכת מאובטחת.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
