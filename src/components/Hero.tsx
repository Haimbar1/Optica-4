import React from 'react';
import { Calendar, Navigation, Glasses, CheckCircle2, MapPin, Clock, Camera, Eye, Sparkles } from 'lucide-react';
import { BRANCHES, ALL_BRANCH_NAMES, branchPath, branchPhone } from '../data/branches';
import { useBranch, HoursGrid } from '../branchContext';
import campaignAdImg from '../assets/images/campaign_ad_square.jpg';

interface HeroProps {
  onOpenBooking?: () => void;
  onOpenContact?: () => void;
  onNavigateToCatalog?: () => void;
  onOpenCampaign?: () => void;
  onOpenTryOn?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenContact, onNavigateToCatalog, onOpenCampaign, onOpenTryOn }) => {
  const branch = useBranch();
  const where = branch ? branch.inName : `ב${ALL_BRANCH_NAMES}`;
  const handleBookingClick = () => {
    if (onOpenBooking) {
      onOpenBooking();
    } else if (onOpenContact) {
      onOpenContact();
    } else {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCatalogClick = () => {
    if (onNavigateToCatalog) {
      onNavigateToCatalog();
    } else {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const products = [
    {
      id: 'hero-product-regular',
      icon: Glasses,
      label: 'מסגרת + עדשות רגילות',
      price: '150',
      note: 'כולל ציפויים • מגוון מסגרות מכל הסוגים',
      fine: 'במספרים גבוהים – תוספת סמלית לדיקוק עדשה',
      accent: 'from-amber-300 to-orange-400',
      ring: 'hover:border-amber-300/70',
    },
    {
      id: 'hero-product-multifocal',
      icon: Eye,
      label: 'עדשות מולטיפוקל',
      price: '800',
      note: 'עדשות יפניות • גרמניות ב-1,200 ₪',
      fine: 'התאמה אישית, ליווי ואחריות על הסתגלות',
      accent: 'from-lime-300 to-emerald-400',
      ring: 'hover:border-lime-300/70',
    },
  ];

  return (
    <section id="hero" className="relative overflow-hidden text-white">
      {/* Sunset backdrop, in the colors of the campaign ad */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1733] via-[#1f2747] to-[#4a2a1c]" />
      <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-amber-500/25 blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-lime-500/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-[40rem] h-64 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 lg:pt-16 lg:pb-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Text + products */}
          <div className="lg:col-span-7 space-y-6 text-right">
            {onOpenCampaign && (
              <button
                id="hero-campaign-banner-btn"
                onClick={onOpenCampaign}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold hover:bg-white/15 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>תרמנו לחיילים – עכשיו מגיע לכולם!</span>
                <span className="text-amber-300 font-black">לפרטים ←</span>
              </button>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-['Rubik'] leading-[1.05]">
              רואים צלול,
              <span className="block mt-2 bg-gradient-to-l from-amber-200 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                משלמים הגון.
              </span>
              <span className="block mt-4 text-xl sm:text-2xl lg:text-3xl font-extrabold text-white/90 leading-snug">
                בדיקת ראייה ומשקפיים {where}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
              אצלנו לא משלמים על המותג שעל השלט או על השכירות בקניון. אופטיקה חברתית {where} –
              בדיקה מקצועית, מסגרות מובחרות ועדשות איכותיות, במחיר שמגיע לכולם.
            </p>

            {/* The two main products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    id={p.id}
                    type="button"
                    onClick={handleBookingClick}
                    className={`group relative text-right rounded-3xl p-5 sm:p-6 bg-white/[0.07] backdrop-blur-md border border-white/15 ${p.ring} hover:bg-white/[0.11] hover:-translate-y-1 transition-all duration-300 shadow-xl cursor-pointer overflow-hidden`}
                  >
                    <div className={`absolute -top-16 -left-16 w-40 h-40 rounded-full bg-gradient-to-br ${p.accent} opacity-20 blur-2xl group-hover:opacity-35 transition-opacity`} />
                    <div className="relative flex items-center gap-2.5">
                      <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.accent} text-slate-900 flex items-center justify-center shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-base sm:text-lg font-extrabold leading-tight">{p.label}</span>
                    </div>
                    <div className="relative mt-4 flex items-end gap-2">
                      <span className={`text-6xl sm:text-7xl font-black font-['Rubik'] leading-none bg-gradient-to-b ${p.accent} bg-clip-text text-transparent`}>
                        {p.price}
                      </span>
                      <span className="pb-1.5 leading-tight">
                        <span className="block text-2xl font-black">₪</span>
                        <span className="block text-sm font-extrabold text-white/80">בלבד!</span>
                      </span>
                    </div>
                    <div className="relative mt-3 text-sm font-semibold text-white/85">{p.note}</div>
                    <div className="relative text-xs text-white/55 mt-1">{p.fine}</div>
                    <div className="relative mt-4 text-sm font-black text-amber-300 group-hover:underline">
                      קבעו תור ←
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleBookingClick}
                className="bg-gradient-to-l from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-900 font-black text-base px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>קביעת תור ביומן עכשיו</span>
              </button>

              {onOpenTryOn && (
                <button
                  id="hero-tryon-btn"
                  onClick={onOpenTryOn}
                  className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base px-5 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-amber-300" />
                  <span>מדידת משקפיים בסלפי</span>
                </button>
              )}

              {branch?.wazeUrl && (
                <a
                  href={branch.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base px-5 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Navigation className="w-5 h-5 text-amber-300" />
                  <span>ניווט ב-Waze</span>
                </a>
              )}

              <button
                onClick={handleCatalogClick}
                className="text-amber-200 hover:underline font-bold text-sm px-2 py-2 cursor-pointer"
              >
                לקטלוג המסגרות ←
              </button>
            </div>
          </div>

          {/* The campaign ad */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-400/40 via-orange-500/20 to-lime-400/30 blur-2xl" />
              <button
                type="button"
                onClick={onOpenCampaign || handleBookingClick}
                className="relative block w-full rounded-[1.75rem] overflow-hidden ring-1 ring-white/25 shadow-2xl lg:rotate-[1.5deg] hover:rotate-0 hover:scale-[1.01] transition-transform duration-500 cursor-pointer"
                aria-label="למבצע ולקביעת תור"
              >
                <img
                  src={campaignAdImg}
                  alt={`האופטיקה החברתית ${branch ? branch.name : ''} – מסגרת ועדשות רגילות 150 ₪, עדשות מולטיפוקל 800 ₪`}
                  className="w-full aspect-square object-cover"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Address, hours, trust strip — one branch's, or the three branches on the home page */}
        {branch ? (
          <div className="mt-12 lg:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href={branch.wazeUrl || '#contact'}
              target={branch.wazeUrl ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-white/[0.07] border border-white/15 px-4 py-3 hover:bg-white/[0.11] transition-colors"
            >
              <span className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </span>
              <span>
                <span className="block font-black font-['Rubik']">{branch.address || `סניף ${branch.name}`}</span>
                <span className="block text-xs text-white/65">
                  {branch.wazeUrl ? `${branch.region} • חניה נוחה • נווט בוויז ←` : `${branch.distanceNote} • הכתובת תישלח עם אישור התור`}
                </span>
              </span>
            </a>

            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.07] border border-white/15 px-4 py-3">
              <span className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </span>
              <span className="text-sm leading-snug">
                <HoursGrid branch={branch} dayClass="font-bold" hoursClass="text-amber-300 font-black text-left" />
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.07] border border-white/15 px-4 py-3 text-sm">
              <span className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <span className="leading-snug">
                <span className="block font-bold">אופטומטריסט מוסמך • אחריות וכיוונון</span>
                <span className="block text-white/70">
                  חנות: <a href={`tel:${branchPhone(branch)}`} dir="ltr" className="text-amber-300 font-black hover:underline">{branchPhone(branch)}</a>
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-12 lg:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3">
            {BRANCHES.map((b) => (
              <a
                key={b.slug}
                href={branchPath(b)}
                className="flex items-center gap-3 rounded-2xl bg-white/[0.07] border border-white/15 px-4 py-3 hover:bg-white/[0.11] transition-colors"
              >
                <span className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </span>
                <span>
                  <span className="block font-black font-['Rubik']">סניף {b.name}</span>
                  <span className="block text-xs text-white/65">{b.comingSoon ? `נפתח בקרוב • ${b.distanceNote}` : `${b.address || b.distanceNote} • לפרטים ותורים ←`}</span>
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
