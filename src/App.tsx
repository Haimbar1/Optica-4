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
  const [currentPage, setCurrentPage] = useState<'main' | 'campaign'>(() => 
    checkIsCampaign() ? 'campaign' : 'main'
  );
  const [activeTab, setActiveTab] = useState('hero'); 
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms'>('privacy');

  useEffect(() => {
    const handleLocationChange = () => {
      if (checkIsCampaign()) {
        setCurrentPage('campaign');
      } else {
        setCurrentPage('main');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (page: 'main' | 'campaign') => {
    setCurrentPage(page);
    const newUrl = page === 'campaign' ? '?page=campaign' : window.location.pathname;
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

  if (currentPage === 'campaign') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Assistant',sans-serif]">
        <CampaignLandingPage
          onBackToMain={() => navigateTo('main')}
          onOpenPrivacy={handleOpenPrivacy}
          onOpenTerms={handleOpenTerms}
        />
        <ChatWidget />
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
      />

      <main className="flex-1">
        <Hero
          onOpenBooking={() => scrollToSection('booking')}
          onOpenCampaign={() => navigateTo('campaign')}
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
      <ChatWidget />

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
}
