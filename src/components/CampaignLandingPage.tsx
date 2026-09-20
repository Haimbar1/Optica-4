import React, { useState, useEffect, useMemo } from 'react';
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
  Award,
  AlertCircle,
  Eye,
  User,
  Send,
  Check,
  Layers
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/opticsData';
import {
  getNextWednesdayDate,
  getFirstAvailableBookingDate,
  getUpcomingBookingDays,
  BookingDayOption,
} from '../utils/dateUtils';
import {
  isValidIsraeliPhone,
  getIsraeliPhoneValidationError,
  formatIsraeliPhone,
} from '../utils/phoneValidation';
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
  const upcomingDays = useMemo<BookingDayOption[]>(() => getUpcomingBookingDays(), []);
  const [selectedDate, setSelectedDate] = useState<string>(() => getFirstAvailableBookingDate());
  const [bookingMode, setBookingMode] = useState<'calendar' | 'callback'>('calendar');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Quick Callback Form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [leadInterest, setLeadInterest] = useState<'glasses150' | 'multifocal' | 'both'>('glasses150');
  const [leadNotes, setLeadNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const calUrl = `https://cal.com/haoptika-hatova/30min?date=${selectedDate}&layout=month_view`;
  const calEmbedUrl = `https://cal.com/haoptika-hatova/30min?date=${selectedDate}&layout=month_view&embed=true`;

  const scrollToBooking = () => {
    const el = document.getElementById('booking-above-fold-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const triggerChatBot = () => {
    const fab = document.getElementById('obw-fab') || document.querySelector('.obw-fab-button');
    if (fab) {
      (fab as HTMLElement).click();
    } else {
      window.open(BUSINESS_INFO.whatsappDirectAvigail, '_blank');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneTouched(true);

    // Validate Israeli phone number
    const validationErr = getIsraeliPhoneValidationError(leadPhone);
    if (validationErr) {
      setPhoneError(validationErr);
      const phoneInput = document.getElementById('lead-phone-input');
      if (phoneInput) {
        phoneInput.focus();
      }
      return;
    }
    setPhoneError(null);

    setIsSubmitting(true);

    const interestLabel =
      leadInterest === 'multifocal'
        ? 'מולטיפוקל (800-1,200 ₪)'
        : leadInterest === 'both'
        ? 'גם משקפי ראייה 150 ₪ וגם מולטיפוקל'
        : 'משקפי ראייה מלאים ב-150 ₪';

    // 1. Extract UTM parameters from current URL
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const utmSource = urlParams.get('utm_source') || 'אתר';
    const utmCampaign = urlParams.get('utm_campaign') || 'קמפיין משקפיים 150 ומולטיפוקל';

    // 2. Build CRM Lead Payload matching SmartEsek specifications with clean Israeli phone
    const customerName = leadName.trim() || 'לקוח מדף נחיתה';
    const customerPhone = formatIsraeliPhone(leadPhone.trim());
    const customerMessage = `מבצע: ${interestLabel}${leadNotes.trim() ? ` | הערה: ${leadNotes.trim()}` : ''}`;

    const leadPayload = {
      name: customerName,
      phone: customerPhone,
      source: utmSource,
      campaign: utmCampaign,
      message: customerMessage,
    };

    // 3. Log all sent details to browser console
    console.log('%c🚀 [SmartEsek CRM] מתחיל ייצוא ליד למערכת...', 'color: #0047AB; font-weight: bold; font-size: 13px;');
    console.log('📋 כל הפרטים שנשלחים (Payload):', leadPayload);
    console.log('🌐 כתובת היעד:', 'https://crm.smartesek.com/api/public/lead');
    console.log('🔑 Headers:', {
      'Content-Type': 'application/json',
      'X-Lead-Key': '1234512345',
    });
    console.log('🏷️ פרמטרי UTM שחולצו:', {
      utm_source: urlParams.get('utm_source') || '(לא נמצא ב-URL, נבחר: "אתר")',
      utm_campaign: urlParams.get('utm_campaign') || '(לא נמצא ב-URL, נבחרה ברירת מחדל)',
    });

    try {
      // 4. Send Lead directly to SmartEsek CRM
      const crmUrl = 'https://crm.smartesek.com/api/public/lead';
      const crmRes = await fetch(crmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Lead-Key': '1234512345',
        },
        body: JSON.stringify(leadPayload),
      });

      const status = crmRes.status;
      const rawText = await crmRes.text().catch(() => '');
      let responseData: any = rawText;
      try {
        responseData = JSON.parse(rawText);
      } catch {
        responseData = rawText;
      }

      if (crmRes.ok) {
        console.log('%c✅ [SmartEsek CRM SUCCESS] הליד נשלח ונקלט בהצלחה!', 'color: #10B981; font-weight: bold; font-size: 13px;');
        console.log('📥 סטטוס תגובה:', status);
        console.log('📥 תשובה שהתקבלה מה-CRM:', responseData);
        console.log('📦 כל הפרטים שנשלחו:', leadPayload);
      } else {
        const errorReason =
          typeof responseData === 'object' && responseData?.error
            ? responseData.error
            : typeof responseData === 'string' && responseData
            ? responseData
            : `HTTP ${status}`;

        console.error('%c❌ [SmartEsek CRM FAILED] שליחת הליד ל-CRM נכשלה!', 'color: #EF4444; font-weight: bold; font-size: 13px;');
        console.error('⚠️ סטטוס שגיאה:', status);
        console.error('⚠️ מדוע לא הצליח (סיבת הכישלון):', errorReason);
        console.error('📥 תשובה מלאה שהתקבלה מהשרת:', responseData);
        console.error('📦 כל הפרטים שנשלחו:', leadPayload);
      }
    } catch (err: any) {
      console.error('%c❌ [SmartEsek CRM ERROR] אירעה שגיאת תקשורת:', 'color: #EF4444; font-weight: bold; font-size: 13px;', err);
      console.error('⚠️ סיבת השגיאה:', err.message || err);
      console.error('📦 כל הפרטים שנשלחו:', leadPayload);
    }

    // 5. Fire to n8n webhook notification as well
    try {
      if (BUSINESS_INFO.webBotWebhook) {
        await fetch(BUSINESS_INFO.webBotWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...leadPayload,
            interest: interestLabel,
            rawNotes: leadNotes.trim(),
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => null);
      }
    } catch {
      // Fallback is smooth
    } finally {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Assistant',sans-serif] selection:bg-[#62B83E] selection:text-white" dir="rtl">
      {/* ========================================================================= */}
      {/* ABOVE THE FOLD HERO: Centered Booking Focal Point Framed by Deals & Info */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F8ED] via-white to-slate-50 pt-2 pb-6 sm:pt-3 sm:pb-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-2.5 sm:space-y-3">
          
          {/* 1. Header Banner: Direct instruction */}
          {/* ============================================================= */}
          {/* 2. THE BOOKING BOARD (Flanked on sides on Desktop; Full width on Mobile) */}
          {/* ============================================================= */}
          <div className="xl:flex xl:items-start xl:justify-center xl:gap-3.5">

            {/* Desktop Right Side Column: Offer 1 + Location & Hours + 2 Trust Badges */}
            <aside className="hidden xl:w-[260px] 2xl:w-[280px] xl:shrink-0 space-y-2.5">
              {/* Offer 1: Full Glasses 150 NIS */}
              <div className="bg-blue-50/95 border-2 border-[#0047AB]/40 rounded-2xl p-3 shadow-xs relative flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#0047AB] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Glasses className="w-4 h-4" />
                  </div>
                  <span className="bg-[#0047AB] text-white text-[10px] font-black px-2 py-0.5 rounded-md">מבצע הדגל</span>
                </div>
                <div>
                  <span className="text-[11px] font-black text-[#0047AB] uppercase block">משקפי ראייה מלאים</span>
                  <div className="flex items-baseline gap-1 my-0.5">
                    <span className="text-2xl font-black text-slate-950 font-['Rubik']">₪150</span>
                    <span className="text-xs font-extrabold text-blue-800">בלבד!</span>
                  </div>
                  <span className="text-[11px] text-slate-600 block mb-1">• מסגרת + עדשות + ציפויים</span>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    כולל בדיקת ראייה חינם ע"י אופטומטריסט מוסמך, ציפוי נגד שריטות ואנטי-רפלקס ללא תוספת מחיר.
                  </p>
                </div>
              </div>

              {/* Location & Hours Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-tight">
                    <strong className="text-slate-900 block font-bold mb-0.5">מיקום הקליניקה:</strong>
                    <span className="text-slate-600">מצפה מנחם 86, אמירים</span>
                    <span className="text-slate-500 block text-[10px]">(15 דק' מכרמיאל, 20 דק' מצפת)</span>
                    <a
                      href="https://waze.com/ul?q=מצפה%20מנחם%2086%20אמירים"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#0047AB] font-bold hover:underline mt-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>ניווט ב-Waze</span>
                    </a>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#0047AB] shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-tight">
                    <strong className="text-slate-900 block font-bold mb-0.5">ימי פעילות:</strong>
                    <span className="text-slate-600">ד', ה': 12:00-18:00</span>
                    <br />
                    <span className="text-slate-600">יום ו': 10:00-14:00</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges: Group 1 */}
              <div className="space-y-1.5">
                <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-2xs flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>אופטומטריסט מוסמך</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-2xs flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>בדיקת ראייה חינם</span>
                </div>
              </div>
            </aside>

            {/* Central Booking Board */}
            <div id="booking-above-fold-card" className="w-full max-w-4xl xl:max-w-[760px] 2xl:max-w-[800px] xl:shrink-0 mx-auto">
            <div className="bg-white rounded-3xl border-2 border-[#0047AB] shadow-xl overflow-hidden">
              
              {/* Card Header with Tabs: Calendar is DEFAULT, with Callback option */}
              <div className="bg-gradient-to-r from-slate-900 via-[#0047AB] to-slate-900 text-white p-2.5 sm:p-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-2.5">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base font-['Rubik']">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
                    <span>קביעת תור מהירה – ללא עלות וללא התחייבות</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#62B83E] text-white text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                      מיידי ביומן • בדיקה חינם
                    </span>
                  </div>
                </div>

                {/* Mode Selector Tabs: Calendar is DEFAULT */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-1 sm:p-1.5 rounded-xl border border-white/10">
                  <button
                    id="tab-calendar-mode-btn"
                    onClick={() => setBookingMode('calendar')}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      bookingMode === 'calendar'
                        ? 'bg-[#0047AB] text-white shadow-md border border-blue-300/40'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span>📅 בחירת מועד ביומן (מומלץ)</span>
                  </button>

                  <button
                    id="tab-callback-mode-btn"
                    onClick={() => setBookingMode('callback')}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      bookingMode === 'callback'
                        ? 'bg-[#62B83E] text-white shadow-md'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>📞 חזרו אליי לקביעת תור</span>
                  </button>
                </div>
              </div>

              {/* TAB 1 (DEFAULT): Embedded Interactive Cal.com Calendar */}
              {bookingMode === 'calendar' && (
                <div className="p-2.5 sm:p-4 bg-white space-y-2.5">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#0047AB] shrink-0" />
                      <span className="font-bold text-slate-800">
                        מועדי הבדיקות הקרובים פתוחים לבחירה. בחרו יום ושעה וקבלו אישור מיידי:
                      </span>
                    </div>
                    <a
                      href={calUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#0047AB] hover:underline font-extrabold text-xs"
                    >
                      <span>פתיחת יומן במסך מלא</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Day Picker Pills: Select Clinic Days Starting from Earliest Open Hour */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-xs font-bold text-slate-700">ימי בדיקות קרובים:</span>
                    {upcomingDays.map((dayOpt) => {
                      const isSelected = selectedDate === dayOpt.date;
                      return (
                        <button
                          key={dayOpt.date}
                          type="button"
                          onClick={() => {
                            setSelectedDate(dayOpt.date);
                            setIframeLoaded(false);
                          }}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0047AB] text-white shadow-sm ring-2 ring-[#0047AB]/30'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {dayOpt.isToday ? 'היום (' + dayOpt.shortLabel + ')' : dayOpt.dayName} • {dayOpt.formattedDate}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-[#0047AB]'
                            }`}
                          >
                            {dayOpt.startHourLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar iframe: Exact height to eliminate wasted space at the bottom and slight zoom/scaling */}
                  <div className="relative w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 h-[470px] sm:h-[485px]">
                    {!iframeLoaded && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50 z-10">
                        <div className="w-8 h-8 border-3 border-[#0047AB] border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="font-bold text-slate-800 text-sm">טוען את יומן הבדיקות...</p>
                        <span className="text-xs text-slate-500 mt-0.5">
                          היומן נפתח בשעה הראשונה הזמינה לבחירה
                        </span>
                      </div>
                    )}
                    <iframe
                      id="cal-com-above-fold-iframe"
                      src={calEmbedUrl}
                      title="קביעת תור ביומן Cal.com"
                      className="w-full h-full border-0"
                      style={{ zoom: 0.94 }}
                      onLoad={() => setIframeLoaded(true)}
                    />
                  </div>

                  {/* Footer actions underneath calendar */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <span>לא מוצאים שעה שנוחה לכם?</span>
                      <button
                        onClick={() => setBookingMode('callback')}
                        className="text-[#62B83E] font-black hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>השאירו שם וטלפון ונחזור אליכם לתיאום אישי ←</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={BUSINESS_INFO.wazeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-700 hover:text-cyan-900 font-bold"
                      >
                        <Navigation className="w-3.5 h-3.5 fill-current" />
                        <span>ניווט ב-Waze</span>
                      </a>
                      <span className="text-slate-300">|</span>
                      <a
                        href={`tel:${BUSINESS_INFO.phoneAvigail}`}
                        className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-bold"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>מתאמת תורים (אביגיל): {BUSINESS_INFO.phoneAvigail}</span>
                      </a>
                      <span className="text-slate-300">|</span>
                      <a
                        href="https://wa.me/972545404183?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%A4%D7%95%D7%A0%D7%94%20%D7%9E%D7%93%D7%A3%20%D7%94%D7%9E%D7%91%D7%A6%D7%A2%20%D7%91%D7%90%D7%95%D7%A4%D7%98%D7%99%D7%A7%D7%94%20%D7%94%D7%98%D7%95%D7%91%D7%94"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#25D366] hover:text-[#20ba59] font-bold"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
                        <span>לחץ למעבר לוואטסאפ (054-540-4183)</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Fast Name & Phone Callback Form */}
              {bookingMode === 'callback' && (
                <div className="p-4 sm:p-7 bg-white space-y-4">
                  {submitSuccess ? (
                    <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 text-center space-y-3 animate-in fade-in">
                      <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                        <Check className="w-7 h-7 stroke-[3]" />
                      </div>
                      <h3 className="text-xl font-black text-emerald-950 font-['Rubik']">
                        הפנייה התקבלה בהצלחה!
                      </h3>
                      <p className="text-sm text-emerald-900 leading-relaxed max-w-md mx-auto">
                        תודה {leadName || ''}! נחזור אליך בהקדם לטלפון <strong>{leadPhone}</strong> כדי לתאם עבורך את השעה הנוחה ביותר לבדיקה והתאמת משקפיים באמירים.
                      </p>
                      <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                          href={`https://wa.me/972545404183?text=${encodeURIComponent(
                            `שלום, השארתי פרטים עבור ${leadInterest === 'multifocal' ? 'מולטיפוקל' : 'משקפיים ב-150 ₪'}. שמי ${leadName}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>לחץ למעבר לוואטסאפ (054-540-4183) 📱</span>
                        </a>
                        <button
                          onClick={() => {
                            setSubmitSuccess(false);
                            setLeadPhone('');
                            setLeadName('');
                            setPhoneError(null);
                            setPhoneTouched(false);
                          }}
                          className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer py-1 px-2"
                        >
                          שליחת פנייה נוספת
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-4 text-right max-w-2xl mx-auto" noValidate>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-700 text-xs sm:text-sm leading-relaxed flex items-center justify-between">
                        <span>השאירו שם וטלפון, ונחזור אליכם בהקדם לתיאום מועד שנוח לכם:</span>
                        <button
                          type="button"
                          onClick={() => setBookingMode('calendar')}
                          className="text-[#0047AB] font-bold hover:underline cursor-pointer shrink-0 mr-2 text-xs"
                        >
                          מעדיפים לבחור ביומן? ←
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Name Input */}
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            שם מלא
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="lead-name-input"
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              placeholder="ישראל ישראלי"
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 pr-10 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20 transition-all text-right"
                            />
                            <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                          </div>
                        </div>

                        {/* Phone Input (Required + Israeli validation) */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-800">
                              טלפון לחזרה <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-500">מספר ישראלי (נייד או קווי)</span>
                          </div>
                          <div className="relative">
                            <input
                              type="tel"
                              id="lead-phone-input"
                              required
                              value={leadPhone}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLeadPhone(val);
                                if (phoneTouched) {
                                  setPhoneError(getIsraeliPhoneValidationError(val));
                                }
                              }}
                              onBlur={() => {
                                setPhoneTouched(true);
                                setPhoneError(getIsraeliPhoneValidationError(leadPhone));
                              }}
                              placeholder="050-1234567"
                              dir="ltr"
                              aria-invalid={!!phoneError && phoneTouched}
                              className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 pr-10 pl-9 text-sm text-slate-900 focus:bg-white focus:outline-hidden transition-all text-right font-mono ${
                                phoneError && phoneTouched
                                  ? 'border-red-500 bg-red-50/40 focus:border-red-600 focus:ring-2 focus:ring-red-500/20 text-red-950'
                                  : phoneTouched && !phoneError && leadPhone.trim()
                                  ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                                  : 'border-slate-300 focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20'
                              }`}
                            />
                            <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                            {phoneTouched && !phoneError && leadPhone.trim() && (
                              <Check className="w-4 h-4 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                            )}
                            {phoneTouched && phoneError && (
                              <AlertCircle className="w-4 h-4 text-red-500 absolute left-3 top-3 pointer-events-none" />
                            )}
                          </div>
                          {phoneError && phoneTouched ? (
                            <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold mt-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{phoneError}</span>
                            </div>
                          ) : phoneTouched && !phoneError && leadPhone.trim() ? (
                            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>מספר טלפון תקין בישראל</span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Interest Selection (Radio/Chips) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          באיזה מבצע אתם מעוניינים?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setLeadInterest('glasses150')}
                            className={`p-3 rounded-xl border text-xs font-bold text-right transition-all cursor-pointer ${
                              leadInterest === 'glasses150'
                                ? 'bg-blue-50 border-[#0047AB] text-[#0047AB] shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="block font-black text-sm text-slate-900">150 ₪</span>
                            <span>משקפי ראייה מלאים</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setLeadInterest('multifocal')}
                            className={`p-3 rounded-xl border text-xs font-bold text-right transition-all cursor-pointer ${
                              leadInterest === 'multifocal'
                                ? 'bg-emerald-50 border-[#62B83E] text-[#38761D] shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="block font-black text-sm text-emerald-900">800-1,200 ₪</span>
                            <span>משקפי מולטיפוקל</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setLeadInterest('both')}
                            className={`p-3 rounded-xl border text-xs font-bold text-right transition-all cursor-pointer ${
                              leadInterest === 'both'
                                ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="block font-black text-sm text-slate-900">גם וגם / ייעוץ</span>
                            <span>בדיקת ראייה חינם</span>
                          </button>
                        </div>
                      </div>

                      {/* Optional Notes */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          הערה / יום מועדף לבדיקה (רביעי, חמישי או שישי)
                        </label>
                        <input
                          type="text"
                          id="lead-notes-input"
                          value={leadNotes}
                          onChange={(e) => setLeadNotes(e.target.value)}
                          placeholder="לדוגמה: יום חמישי אחה״צ, מספר קיים..."
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0047AB] text-right"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        id="submit-callback-lead-btn"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#62B83E] hover:bg-[#529e32] text-white font-black text-base py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>שולח פנייה...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>חזרו אליי לקביעת תור (ללא עלות)</span>
                          </>
                        )}
                      </button>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                        <a
                          href="https://wa.me/972545404183?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%2F%D7%AA%20%D7%91%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%9E%D7%91%D7%A6%D7%A2%20%D7%91%D7%90%D7%95%D7%A4%D7%98%D7%99%D7%A7%D7%94%20%D7%94%D7%98%D7%95%D7%91%D7%94%20%D7%91%D7%90%D7%9E%D7%99%D7%A8%D7%99%D7%9D"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm py-2 px-4 rounded-xl shadow-xs transition-colors w-full sm:w-auto"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>לפנייה ישירה בוואטסאפ: לחץ למעבר לוואטסאפ (054-540-4183) 📱</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => setBookingMode('calendar')}
                          className="text-[#0047AB] hover:underline cursor-pointer font-bold text-xs"
                        >
                          מעדיפים לבחור שעה ביומן? לחצו כאן
                        </button>
                      </div>

                      <div className="flex items-center justify-start text-[11px] text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>פרטיכם שמורים ומאובטחים</span>
                        </span>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Desktop Left Side Column: Offer 2 + Avigail Phone + 2 Trust Badges */}
          <aside className="hidden xl:w-[260px] 2xl:w-[280px] xl:shrink-0 space-y-2.5">
            {/* Offer 2: Multifocal 800 - 1,200 NIS */}
            <div className="bg-emerald-50/95 border-2 border-[#62B83E] rounded-2xl p-3 shadow-xs relative flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#4C9C29] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="bg-[#4C9C29] text-white text-[10px] font-black px-2 py-0.5 rounded-md">במקום 4,000 ₪!</span>
              </div>
              <div>
                <span className="text-[11px] font-black text-[#38761D] uppercase block">משקפי מולטיפוקל פרימיום</span>
                <div className="flex items-baseline gap-1 my-0.5">
                  <span className="text-2xl font-black text-emerald-950 font-['Rubik']">800 - 1,200 ₪</span>
                </div>
                <span className="text-[11px] text-slate-500 line-through block mb-1">4,000 ₪ ברשתות</span>
                <p className="text-[11px] text-slate-600 leading-tight">
                  עדשות מתקדמות עם שדה ראייה רחב, התאמת PD בדיוק מילימטרי ע"י אופטומטריסט מוסמך ואחריות הסתגלות.
                </p>
              </div>
            </div>

            {/* Personal Care / Avigail Direct Call Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>מענה אישי לתיאום תור:</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                רוצים עזרה בקביעת שעה או לברר זמינות מיוחדת?
              </p>
              <a
                href={`tel:${BUSINESS_INFO.phoneAvigail}`}
                className="w-full text-center py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-black text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>אביגיל: {BUSINESS_INFO.phoneAvigail}</span>
              </a>
            </div>

            {/* Trust Badges: Group 2 */}
            <div className="space-y-1.5">
              <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-2xs flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ללא אותיות קטנות</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-2xs flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>חניה חופשית במקום</span>
              </div>
            </div>
          </aside>

        </div>

        {/* ============================================================= */}
        {/* MOBILE & TABLET ONLY (< xl): Clean Stack Underneath Calendar */}
        {/* ============================================================= */}
        <div className="xl:hidden space-y-2.5 max-w-4xl mx-auto pt-1">
          {/* Mobile Deals: 150 NIS & Multifocal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {/* Offer 1: Full Glasses 150 NIS */}
            <div className="bg-blue-50/90 border-2 border-[#0047AB]/40 rounded-2xl p-3 shadow-xs relative flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#0047AB] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Glasses className="w-5 h-5" />
              </div>
              <div className="text-right flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#0047AB] uppercase">משקפי ראייה מלאים</span>
                  <span className="bg-[#0047AB] text-white text-[10px] font-black px-2 py-0.5 rounded-md">מבצע הדגל</span>
                </div>
                <div className="flex items-baseline gap-1 my-0.5">
                  <span className="text-2xl font-black text-slate-950 font-['Rubik']">₪150</span>
                  <span className="text-xs font-extrabold text-blue-800">בלבד!</span>
                  <span className="text-[11px] text-slate-600 mr-1.5">• מסגרת + עדשות + ציפויים</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  כולל בדיקת ראייה חינם ע"י אופטומטריסט מוסמך, ציפוי נגד שריטות ואנטי-רפלקס ללא תוספת מחיר.
                </p>
              </div>
            </div>

            {/* Offer 2: Multifocal 800 - 1,200 NIS */}
            <div className="bg-emerald-50/90 border-2 border-[#62B83E] rounded-2xl p-3 shadow-xs relative flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#4C9C29] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-right flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#38761D] uppercase">משקפי מולטיפוקל פרימיום</span>
                  <span className="bg-[#4C9C29] text-white text-[10px] font-black px-2 py-0.5 rounded-md">במקום 4,000 ₪!</span>
                </div>
                <div className="flex items-baseline gap-1 my-0.5">
                  <span className="text-2xl font-black text-emerald-950 font-['Rubik']">800 - 1,200 ₪</span>
                  <span className="text-[11px] text-slate-500 line-through mr-1">4,000 ₪ ברשתות</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  עדשות מתקדמות עם שדה ראייה רחב, התאמת PD בדיוק מילימטרי ע"י אופטומטריסט מוסמך ואחריות הסתגלות.
                </p>
              </div>
            </div>
          </div>

          {/* Location & Hours Quick Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 sm:p-3 shadow-2xs flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>
                <strong>מיקום: </strong>
                מצפה מנחם 86, אמירים (15 דק' מכרמיאל, 20 דק' מצפת • חניה חופשית מול הדלת)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0047AB] shrink-0" />
              <span>
                <strong>ימי פעילות: </strong>
                ד', ה' (12:00-18:00) | יום ו' (10:00-14:00)
              </span>
            </div>

            <a
              href={`tel:${BUSINESS_INFO.phoneAvigail}`}
              className="inline-flex items-center gap-1 text-[#0047AB] hover:underline font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>תיאום תורים (אביגיל): {BUSINESS_INFO.phoneAvigail}</span>
            </a>
          </div>

          {/* 4 Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold text-slate-700">
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-2xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>אופטומטריסט מוסמך</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-2xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>בדיקת ראייה חינם</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-2xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ללא אותיות קטנות</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-2xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>חניה חופשית במקום</span>
            </div>
          </div>
        </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: Deep Dive on the Two Exclusive Campaign Offers (150 ₪ & Multifocal) */}
      {/* ========================================================================= */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[#0047AB] font-black text-xs tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full">
              שקיפות חברתית מלאה
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-['Rubik']">
              שני מסלולי המבצע המשתלמים שלנו באמירים
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              איך אנחנו מוכרים במחירים כאלה? פשוט מאוד: אופטיקה חברתית ללא שכירות מנופחת בקניונים וללא פערי תיווך של רשתות.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* CARD 1: Full Glasses 150 ₪ */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 hover:border-[#0047AB] transition-colors shadow-2xs relative">
              <div className="inline-flex items-center gap-1.5 bg-blue-100 text-[#0047AB] text-xs font-black px-3 py-1 rounded-full">
                <Glasses className="w-4 h-4" />
                <span>מסלול ראייה / קריאה שלם</span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-[#0047AB] font-['Rubik']">₪150</span>
                  <span className="text-sm font-bold text-slate-600">מחיר סופי לזוג שלם</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 font-['Rubik'] mt-1">
                  מסגרת איכותית + עדשות אופטיות עם ציפויים
                </h3>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>בדיקת ראייה מקצועית בחינם:</strong> מבוצעת ע"י אופטומטריסט מוסמך ומקצועי.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>מסגרת לבחירה:</strong> מגוון רחב של מסגרות מודרניות, קלאסיות וקלות משקל.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>ציפויים מלאים כלולים:</strong> אנטי-רפלקס נגד סנוור בנהיגה ובמסכים + הגנה משריטות.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>ערכה מלאה:</strong> כולל נרתיק קשיח ומטלית מיקרופייבר.</span>
                </li>
              </ul>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setBookingMode('calendar');
                    scrollToBooking();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0047AB] hover:bg-blue-800 text-white font-extrabold text-sm py-3 px-5 rounded-2xl shadow-xs transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>קביעת תור ביומן למשקפיים ב-150 ₪</span>
                </button>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setBookingMode('callback');
                      setLeadInterest('glasses150');
                      scrollToBooking();
                    }}
                    className="text-xs text-slate-600 hover:text-[#0047AB] font-bold underline cursor-pointer"
                  >
                    מעדיפים שנחזור אליכם טלפונית? השאירו פרטים ←
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: MULTIFOCAL 800 - 1,200 ₪ (CRITICAL REQUIREMENT) */}
            <div className="bg-emerald-50/50 border-2 border-[#62B83E] rounded-3xl p-6 sm:p-8 space-y-5 hover:border-[#4C9C29] transition-colors shadow-sm relative">
              <div className="inline-flex items-center gap-1.5 bg-[#4C9C29] text-white text-xs font-black px-3 py-1 rounded-full">
                <Layers className="w-4 h-4" />
                <span>מבצע מולטיפוקל ללא תחרות</span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-5xl font-black text-emerald-950 font-['Rubik']">800 - 1,200 ₪</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 line-through">במקום 4,000 ₪ ברשתות!</span>
                    <span className="text-xs font-black text-emerald-700">חיסכון של עד 3,000 ₪</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 font-['Rubik'] mt-1">
                  משקפי מולטיפוקל מתקדמים – ראייה חלקה לכל המרחקים
                </h3>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>עדשות מולטיפוקל איכותיות:</strong> מעבר רציף וטבעי בין קריאה (קרוב), מחשב (ביניים) ונהיגה (רחוק).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>בדיקת התאמה מולטיפוקל יסודית:</strong> מדידות גובה ומרחק אישונים (PD) בדיוק מילימטרי.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>במקום לשלם 3,500-4,500 ₪:</strong> מחיר חברתי נגיש שמאפשר לכל אדם ליהנות ממולטיפוקל איכותי.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>אחריות הסתגלות מלאה:</strong> ליווי אישי עד שאתם רואים בצורה מושלמת ונוחה.</span>
                </li>
              </ul>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setBookingMode('calendar');
                    scrollToBooking();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#62B83E] hover:bg-[#529e32] text-white font-extrabold text-sm py-3 px-5 rounded-2xl shadow-md transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>קביעת תור ביומן למולטיפוקל (בדיקה חינם)</span>
                </button>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setBookingMode('callback');
                      setLeadInterest('multifocal');
                      scrollToBooking();
                    }}
                    className="text-xs text-slate-600 hover:text-[#38761D] font-bold underline cursor-pointer"
                  >
                    מעדיפים שנחזור אליכם טלפונית? השאירו פרטים ←
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: Location & Waze Navigation */}
      {/* ========================================================================= */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-slate-900 via-[#0A2540] to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#0047AB]/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#62B83E]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4 text-right">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>הגעה פשוטה ונוחה בלב הגליל</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-['Rubik'] text-white">
                  איך מגיעים אלינו לאמירים?
                </h3>

                <div className="space-y-2 text-slate-200 text-sm sm:text-base leading-relaxed">
                  <p className="font-extrabold text-white text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-400 shrink-0" />
                    <span>מצפה מנחם 86, אמירים. 15 ק"מ מכרמיאל לכיוון צפת.</span>
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm">
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
                    href={`tel:${BUSINESS_INFO.phoneAvigail}`}
                    className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-3.5 rounded-2xl transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4 text-emerald-300" />
                    <span>חיוג לאביגיל (מתאמת תורים): {BUSINESS_INFO.phoneAvigail}</span>
                  </a>

                  <a
                    href="https://wa.me/972545404183?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%A4%D7%95%D7%A0%D7%94%20%D7%9E%D7%93%D7%A3%20%D7%94%D7%9E%D7%91%D7%A6%D7%A2%20%D7%91%D7%90%D7%95%D7%A4%D7%98%D7%99%D7%A7%D7%94%20%D7%94%D7%98%D7%95%D7%91%D7%94"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-4 py-3.5 rounded-2xl transition-colors text-sm shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>לחץ למעבר לוואטסאפ (054-540-4183) 📱</span>
                  </a>
                </div>
              </div>

              {/* Coordinates and visual distance card */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 border-b border-white/10 pb-2">
                  <span>נקודת ציון GPS:</span>
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
                    <span className="text-[11px] text-slate-400 block">זמני נסיעה לדוגמה:</span>
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

      {/* ========================================================================= */}
      {/* SECTION: FAQ Accordion (Updated with Multifocal details) */}
      {/* ========================================================================= */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Rubik']">
              שאלות נפוצות על המבצע
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              כל מה שחשוב לדעת על משקפי ה-150 ₪ ועל המולטיפוקל
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'כמה עולים אצלכם משקפי מולטיפוקל ומה זה כולל?',
                a: 'משקפי מולטיפוקל מלאים (מסגרת איכותית + עדשות מולטיפוקל מתקדמות עם שדה ראייה רחב + בדיקת התאמה מקיפה ואחריות) עולים אצלנו 800 עד 1,200 ₪ בלבד (תלוי בסוג העדשה והציפויים), במקום 3,500-4,500 ₪ שגובים ברשתות!',
              },
              {
                q: 'האם המחיר של 150 ₪ באמת כולל גם מסגרת וגם עדשות?',
                a: 'חד משמעית כן! החבילה כוללת מסגרת מלאה לבחירה מתוך המגוון המשתתף במבצע + זוג עדשות אופטיות איכותיות כולל ציפוי אנטי-רפלקס ונגד שריטות + בדיקת ראייה ללא עלות.',
              },
              {
                q: 'באילו ימים ושעות אפשר להגיע לבדיקה?',
                a: 'שעות הפעילות הן: ימים ד\' ו-ה\' בין 12:00 ל-18:00, ויום ו\' בין 10:00 ל-14:00. ההגעה הינה בתיאום מראש בלבד דרך היומן, הטלפון או השארת פרטים למעלה.',
              },
              {
                q: 'איך עובדת השארת הפרטים לקביעת תור?',
                a: 'פשוט משאירים שם וטלפון בטופס שלמעלה בראש הדף. אביגיל (מתאמת התורים) או צביקה יחזרו אליכם בהקדם ויתאמו עבורכם שעה שנוחה לכם, מבלי שתצטרכו להסתבך עם לוח שנה.',
              },
              {
                q: 'האם אפשר להביא מרשם מוכן מבדיקה קודמת?',
                a: 'בהחלט! אם יש לכם מרשם עדכני מרופא עיניים או אופטומטריסט שאתם מרוצים ממנו, אפשר להביא אותו ונכין לפיו בדיוק. כמובן שניתן גם לעבור אצלנו בדיקה מלאה בחינם.',
              },
              {
                q: 'תוך כמה זמן המשקפיים מוכנים?',
                a: 'מרשמים עם עדשות במלאי מוכנים בדרך כלל תוך ימים ספורים בלבד. עדשות מיוחדות או מולטיפוקל מוכנות תוך 7-10 ימי עסקים.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-right p-4 font-bold text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-sm sm:text-base cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0047AB] shrink-0 transition-transform duration-200 ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
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
              משקפי ראייה ב-150 ₪ או מולטיפוקל ב-800-1,200 ₪ במקום 4,000 ₪. השאירו פרטים בראש הדף או צרו קשר ישיר.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToBooking}
              className="bg-[#62B83E] hover:bg-[#529e32] text-white font-black text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
            >
              קביעת תור בראש הדף
            </button>
            <button
              onClick={triggerChatBot}
              className="bg-white/20 hover:bg-white/30 text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-amber-300" />
              <span>בוט לקביעת תור</span>
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
