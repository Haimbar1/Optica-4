import React, { useState } from 'react'; 
import { Eye, Phone, MapPin, Menu, X, Calendar, MessageCircle, Navigation, Glasses, Clock } from 'lucide-react';
import { BUSINESS_INFO } from '../data/opticsData';
import logoImg from '../assets/images/logo_optics.svg';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenCampaign?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenBooking, onOpenCampaign }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'booking', label: 'בדיקת ראייה ותיאום תור' },
    { id: 'about', label: 'אופטיקה חברתית' },
    { id: 'faq', label: 'שאלות ותשובות ' },
    { id: 'contact', label: 'צור קשר והוראות הגעה' }, 
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-[#0047AB] text-white py-2 px-4 text-xs sm:text-sm font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#E8F0FE] text-[#0047AB] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
              מיזם אופטיקה חברתי באמירים
            </span>
            <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full font-bold text-amber-200 text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>מצפה מנחם 86, אמירים</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black text-xs sm:text-sm shadow-xs whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>
                שעות: <span className="whitespace-nowrap">ד', ה' <span dir="ltr">12:00-18:00</span></span> | <span className="whitespace-nowrap">ו' <span dir="ltr">10:00-14:00</span></span>
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={BUSINESS_INFO.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-100 transition-colors font-bold bg-white/10 px-2.5 py-0.5 rounded-lg"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-300" />
              <span>ניווט ב-Waze</span>
            </a>
            <span className="text-white/30">|</span>
            <a
              href={`tel:${BUSINESS_INFO.phoneAvigail}`}
              className="flex items-center gap-1 hover:text-blue-100 transition-colors font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>אביגיל (תורים): {BUSINESS_INFO.phoneAvigail}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={logoImg}
              alt="האופטיקה הטובה"
              className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform border border-emerald-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-[#0047AB] font-['Rubik']">
                  האופטיקה הטובה
                </span>
              </div>
              <span className="text-[11px] font-bold text-gray-500 tracking-wide block">
                מצפה מנחם 86, אמירים
              </span>
            </div>
          </div>

          {/* Navigation Links - Visible in Top Header */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isBooking = item.id === 'booking';
              const isActive = activeTab === item.id;
              let btnStyle = '';

              if (isBooking) {
                btnStyle = isActive
                  ? 'bg-[#002D6B] text-white font-black shadow-md ring-2 ring-blue-300'
                  : 'bg-[#0047AB] text-white hover:bg-[#003580] font-extrabold shadow-xs';
              } else {
                btnStyle = isActive
                  ? 'bg-[#E8F0FE] text-[#0047AB]'
                  : 'text-gray-700 hover:text-[#0047AB] hover:bg-gray-50';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${btnStyle}`}
                >
                  {item.label}
                </button>
              );
            })}

            {onOpenCampaign && (
              <button
                id="navbar-campaign-link-btn"
                onClick={onOpenCampaign}
                className="px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-black bg-gradient-to-r from-[#62B83E] to-[#4C9C29] text-white hover:opacity-95 shadow-xs flex items-center gap-1.5 cursor-pointer animate-pulse whitespace-nowrap"
              >
                <span>🔥 מבצעי קמפיין (150 ₪ / מולטיפוקל)</span>
              </button>
            )}
          </nav>

          {/* CTA Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href={BUSINESS_INFO.whatsappDirectZvika}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-[#25D366] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="וואטסאפ צביקה"
            >
              <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
              <span className="hidden xl:inline">וואטסאפ</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Top Mobile Scrollable Menu Bar (Always visible at top on mobile) */}
      <div className="md:hidden bg-slate-50 border-t border-b border-gray-200 px-3 py-2 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1.5 min-w-max">
          {navItems.map((item) => {
            const isBooking = item.id === 'booking';
            const isActive = activeTab === item.id;
            let mobileBtnStyle = '';

            if (isBooking) {
              mobileBtnStyle = isActive
                ? 'bg-[#002D6B] text-white font-black ring-2 ring-blue-300'
                : 'bg-[#0047AB] text-white font-extrabold shadow-2xs';
            } else {
              mobileBtnStyle = isActive
                ? 'bg-[#E8F0FE] text-[#0047AB] border border-blue-200'
                : 'bg-white text-gray-800 border border-gray-200 hover:bg-blue-50 hover:text-[#0047AB]';
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${mobileBtnStyle}`}
              >
                {item.label}
              </button>
            );
          })}
          {onOpenCampaign && (
            <button
              id="mobile-scroll-campaign-btn"
              onClick={onOpenCampaign}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#62B83E] to-[#4C9C29] text-white whitespace-nowrap cursor-pointer shadow-2xs"
            >
              🔥 מבצע 150 ₪ ומולטיפוקל
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <div className="grid gap-1 py-2">
            {onOpenCampaign && (
              <button
                id="mobile-dropdown-campaign-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCampaign();
                }}
                className="w-full text-right px-4 py-3 rounded-xl text-base font-black bg-gradient-to-r from-[#EDF7E5] to-[#D8EECA] text-[#2C6A15] border border-[#B7E2A0] transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>🔥 דף קמפיין: משקפיים ב-150 ₪ ומולטיפוקל ב-800-1,200 ₪</span>
                <span className="text-xs bg-[#4C9C29] text-white px-2 py-0.5 rounded-full font-bold">מעבר</span>
              </button>
            )}
            {navItems.map((item) => {
              const isBooking = item.id === 'booking';
              const isActive = activeTab === item.id;
              let dropdownBtnStyle = '';

              if (isBooking) {
                dropdownBtnStyle = isActive
                  ? 'bg-[#002D6B] text-white font-black'
                  : 'bg-[#0047AB] text-white font-extrabold';
              } else {
                dropdownBtnStyle = isActive
                  ? 'bg-[#E8F0FE] text-[#0047AB] font-extrabold'
                  : 'text-slate-700 hover:bg-slate-50';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-right px-4 py-3 rounded-xl text-base font-bold transition-colors cursor-pointer ${dropdownBtnStyle}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="https://wa.me/972545404183?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%90%D7%95%D7%A4%D7%98%D7%99%D7%A7%D7%94%20%D7%94%D7%98%D7%95%D7%91%D7%94%20%D7%91%D7%90%D7%9E%D7%99%D7%A8%D7%99%D7%9D"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded-xl font-bold text-center flex items-center justify-center gap-2 text-sm cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>לחץ למעבר לוואטסאפ (054-540-4183) 📱</span>
            </a>
            <a
              href={BUSINESS_INFO.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-100 text-slate-800 py-2.5 rounded-xl font-bold text-center flex items-center justify-center gap-2 border border-slate-200 text-sm cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#0047AB]" />
              <span>ניווט ב-Waze לחנות (מצפה מנחם 86, אמירים)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
