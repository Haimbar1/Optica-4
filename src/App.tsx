import React, { useState, useEffect } from 'react'; 
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AppointmentSection } from './components/AppointmentSection';
import { AboutSocialOptics } from './components/AboutSocialOptics';
import { FaqSection } from './components/FaqSection';
import { ContactLocationSection } from './components/ContactLocationSection';
import { ChatWidget } from './components/ChatWidget';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModal';
import { CampaignLandingPage } from './components/CampaignLandingPage';
import { TryOnPage } from './components/TryOnPage';
import { OurFramesSection } from './components/OurFramesSection';

type Page = 'main' | 'campaign' | 'tryon';

function checkIsTryOn(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase();

  return (
    path.includes('/tryon') ||
    search.has('tryon') ||
    search.get('page') === 'tryon' ||
    hash === '#tryon'
  );
}

function detectPage(): Page {
  if (checkIsTryOn()) return 'tryon';
  return checkIsCampaign() ? 'campaign' : 'main';
}

function checkIsCampaign(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase();

  return (
    path.includes('/campaign') ||
    path.includes('/lp') ||
    path.includes('/150') ||
    path.includes('/promo') ||
    search.has('campaign') ||
    search.has('campiagn') || // misspelling used in live ad links
    search.has('lp') ||
    search.has('150') ||
    search.get('page') === 'campaign' ||
    search.get('p') === 'campaign' ||
    hash === '#campaign' ||
    hash === '#lp' ||
    hash === '#150'
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(detectPage);
  const [activeTab, setActiveTab] = useState('hero'); 
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms'>('privacy');

  useEffect(() => {
    const handleLocationChange = () => setCurrentPage(detectPage());

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // The page's URL with every other parameter kept (utm_campaign, utm_source, fbclid ...),
  // so a booking made after moving between pages still says where the visitor came from.
  const urlFor = (page: Page, frameId?: string) => {
    const params = new URLSearchParams(window.location.search);
    ['page', 'p', 'lp', '150', 'tryon', 'frame'].forEach((k) => params.delete(k));
    // "?campaign=<name>" also opens the campaign page - keep the name as utm_campaign instead
    const campaign = params.get('campaign') || params.get('campiagn');
    params.delete('campaign');
    params.delete('campiagn');
    if (campaign && !params.has('utm_campaign')) params.set('utm_campaign', campaign);
    const qs = params.toString();
    const own = page === 'main' ? '' : `page=${page}${frameId ? `&frame=${encodeURIComponent(frameId)}` : ''}`;
    const search = [own, qs].filter(Boolean).join('&');
    return search ? `${window.location.pathname}?${search}` : window.location.pathname;
  };

  // דף המדידה עם מסגרת מסוימת שנבחרה מראש (?page=tryon&frame=<id>) – מהסקשן "המסגרות שלנו" ומהקישורים של הבוט
  const openTryOnWithFrame = (frameId: string) => {
    setCurrentPage('tryon');
    window.history.pushState({ page: 'tryon' }, '', urlFor('tryon', frameId));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.history.pushState({ page }, '', urlFor(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // כל כפתור "קביעת תור" באתר מוביל לדף עם היומן המוטמע
  const openBooking = () => navigateTo('campaign');

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' }); 
    }
  };

  const handleOpenPrivacy = () => {
    setLegalModalTab('privacy');
    setIsLegalModalOpen(true);
  };

  const handleOpenTerms = () => {
    setLegalModalTab('terms');
    setIsLegalModalOpen(true);
  };

  if (currentPage === 'tryon') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Assistant',sans-serif]">
        <TryOnPage
          onBackToMain={() => navigateTo('main')}
          onBookAppointment={openBooking}
        />
        <style>{`@media (max-width: 767px) { #obw-fab, .obw-fab, #obw-window, .obw-window, .obw-fab-button, [id^="obw-"] { display: none !important; } }`}</style>
      </div>
    );
  }

  if (currentPage === 'campaign') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Assistant',sans-serif]">
        <CampaignLandingPage
          onBackToMain={() => navigateTo('main')}
          onOpenPrivacy={handleOpenPrivacy}
          onOpenTerms={handleOpenTerms}
        />
        <style>{`@media (max-width: 767px) { #obw-fab, .obw-fab, #obw-window, .obw-window, .obw-fab-button, [id^="obw-"] { display: none !important; } }`}</style>
        <ChatWidget isCampaignPage={true} />
        <LegalModal
          isOpen={isLegalModalOpen}
          onClose={() => setIsLegalModalOpen(false)}
          initialTab={legalModalTab}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Assistant',sans-serif]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={openBooking}
        onOpenCampaign={() => navigateTo('campaign')}
        onOpenTryOn={() => navigateTo('tryon')}
      />

      <main className="flex-1">
        <Hero
          onOpenBooking={openBooking}
          onOpenCampaign={() => navigateTo('campaign')}
          onOpenTryOn={() => navigateTo('tryon')}
        />

        <AppointmentSection onOpenBooking={openBooking} />
        <OurFramesSection onTryOn={openTryOnWithFrame} />
        <AboutSocialOptics />
        <FaqSection />
        <ContactLocationSection />
      </main>

      <Footer
        onOpenPrivacy={handleOpenPrivacy}
        onOpenTerms={handleOpenTerms}
      />
      <ChatWidget isCampaignPage={false} />

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
}
