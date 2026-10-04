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
import { SettingsPage } from './components/SettingsPage';

type Page = 'main' | 'campaign' | 'tryon' | 'settings';

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

function checkIsSettings(): boolean {
  if (typeof window === 'undefined') return false;
  const search = new URLSearchParams(window.location.search);
  return search.get('page') === 'settings' || window.location.hash.toLowerCase() === '#settings';
}

function detectPage(): Page {
  if (checkIsSettings()) return 'settings';
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

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    const newUrl = page === 'main' ? window.location.pathname : `?page=${page}`;
    window.history.pushState({ page }, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  if (currentPage === 'settings') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Assistant',sans-serif]">
        <SettingsPage onBackToMain={() => navigateTo('main')} onOpenTryOn={() => navigateTo('tryon')} />
        <style>{`#obw-fab, .obw-fab, #obw-window, .obw-window, .obw-fab-button, [id^="obw-"] { display: none !important; }`}</style>
      </div>
    );
  }

  if (currentPage === 'tryon') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Assistant',sans-serif]">
        <TryOnPage
          onBackToMain={() => navigateTo('main')}
          onBookAppointment={() => {
            navigateTo('main');
            setTimeout(() => scrollToSection('booking'), 150);
          }}
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
        onOpenBooking={() => scrollToSection('booking')}
        onOpenCampaign={() => navigateTo('campaign')}
        onOpenTryOn={() => navigateTo('tryon')}
      />

      <main className="flex-1">
        <Hero
          onOpenBooking={() => scrollToSection('booking')}
          onOpenCampaign={() => navigateTo('campaign')}
          onOpenTryOn={() => navigateTo('tryon')}
        />

        <AppointmentSection />
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
