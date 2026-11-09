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
import { BranchesSection } from './components/BranchesSection';
import { BranchLocationSection } from './components/BranchLocationSection';
import { BranchContext } from './branchContext';
import {
  Branch,
  BranchSlug,
  BRANCHES,
  branchBySlug,
  branchJsonLd,
  SITE_URL,
  BRAND_NAME,
  ALL_BRANCH_NAMES,
} from './data/branches';

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

// The branch is the path's first part (/pardes-hanna, /shlomi, /amirim) or ?branch=
function detectBranch(): Branch | null {
  if (typeof window === 'undefined') return null;
  const first = window.location.pathname.split('/').filter(Boolean)[0];
  return branchBySlug(first) || branchBySlug(new URLSearchParams(window.location.search).get('branch'));
}

const HOME_TITLE = `${BRAND_NAME} | בדיקת ראייה ומשקפיים ב-150 ₪ – ${ALL_BRANCH_NAMES}`;
const HOME_DESCRIPTION = `מיזם אופטיקה חברתית: בדיקת ראייה חינם, משקפי ראייה מלאים ב-150 ₪ ועדשות מולטיפוקל מ-800 ₪. סניפים ב${ALL_BRANCH_NAMES}. קביעת תור ביומן.`;

function setMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

// Title, description, canonical and Google's structured data follow the open branch
// (the built HTML of each branch page already has them — this keeps them right while moving inside the site).
function applyHead(branch: Branch | null) {
  const title = branch ? branch.seoTitle : HOME_TITLE;
  const description = branch ? branch.seoDescription : HOME_DESCRIPTION;
  const url = `${SITE_URL}${branch ? `/${branch.slug}` : '/'}`;
  document.title = title;
  setMeta('meta[name="description"]', 'content', description);
  setMeta('link[rel="canonical"]', 'href', url);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[property="og:url"]', 'content', url);
  const old = document.getElementById('branch-jsonld');
  if (old) old.remove();
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'branch-jsonld';
  script.textContent = JSON.stringify(branch ? branchJsonLd(branch) : BRANCHES.map(branchJsonLd));
  document.head.appendChild(script);
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
  const [branch, setBranch] = useState<Branch | null>(detectBranch);
  const [activeTab, setActiveTab] = useState('hero'); 
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms'>('privacy');

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPage(detectPage());
      setBranch(detectBranch());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    applyHead(branch);
  }, [branch]);

  // The page's URL with every other parameter kept (utm_campaign, utm_source, fbclid ...),
  // so a booking made after moving between pages still says where the visitor came from.
  // `to` = the branch the new URL is for (undefined = stay in the current one, null = the home page).
  const urlFor = (page: Page, frameId?: string, to?: Branch | null) => {
    const params = new URLSearchParams(window.location.search);
    ['page', 'p', 'lp', '150', 'tryon', 'frame', 'branch'].forEach((k) => params.delete(k));
    const target = to === undefined ? branch : to;
    // Any path that isn't a branch's (/campaign, /150 ...) is left as is when staying put
    const pathname = to === undefined && !branch ? window.location.pathname : target ? `/${target.slug}` : '/';
    // "?campaign=<name>" also opens the campaign page - keep the name as utm_campaign instead
    const campaign = params.get('campaign') || params.get('campiagn');
    params.delete('campaign');
    params.delete('campiagn');
    if (campaign && !params.has('utm_campaign')) params.set('utm_campaign', campaign);
    const qs = params.toString();
    const own = page === 'main' ? '' : `page=${page}${frameId ? `&frame=${encodeURIComponent(frameId)}` : ''}`;
    const search = [own, qs].filter(Boolean).join('&');
    return search ? `${pathname}?${search}` : pathname;
  };

  // דף המדידה עם מסגרת מסוימת שנבחרה מראש (?page=tryon&frame=<id>) – מהסקשן "המסגרות שלנו" ומהקישורים של הבוט
  const openTryOnWithFrame = (frameId: string) => {
    setCurrentPage('tryon');
    window.history.pushState({ page: 'tryon' }, '', urlFor('tryon', frameId));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (page: Page, to?: Branch | null) => {
    const url = urlFor(page, undefined, to);
    setCurrentPage(page);
    if (to !== undefined) setBranch(to);
    window.history.pushState({ page }, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // כל כפתור "קביעת תור" באתר מוביל לדף עם היומן המוטמע – של הסניף הפתוח (בדף הבית: אמירים, עם בחירת סניף)
  const openBooking = () => navigateTo('campaign');
  const bookBranch = (slug: BranchSlug) => navigateTo('campaign', branchBySlug(slug));
  const openBranch = (slug: BranchSlug) => navigateTo('main', branchBySlug(slug));
  const openHome = () => navigateTo('main', null);

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
      <BranchContext.Provider value={branch}>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Assistant',sans-serif]">
        <TryOnPage
          onBackToMain={() => navigateTo('main')}
          onBookAppointment={openBooking}
        />
        <style>{`@media (max-width: 767px) { #obw-fab, .obw-fab, #obw-window, .obw-window, .obw-fab-button, [id^="obw-"] { display: none !important; } }`}</style>
      </div>
      </BranchContext.Provider>
    );
  }

  if (currentPage === 'campaign') {
    return (
      <BranchContext.Provider value={branch}>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Assistant',sans-serif]">
        <CampaignLandingPage
          onBackToMain={() => navigateTo('main')}
          onSwitchBranch={(slug) => {
            const b = branchBySlug(slug);
            setBranch(b);
            window.history.replaceState({ page: 'campaign' }, '', urlFor('campaign', undefined, b));
          }}
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
      </BranchContext.Provider>
    );
  }

  return (
    <BranchContext.Provider value={branch}>
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Assistant',sans-serif]">
      <Navbar
        onOpenHome={openHome}
        onOpenBranches={() => (branch ? openHome() : scrollToSection('branches'))}
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

        {branch ? (
          <AppointmentSection onOpenBooking={openBooking} />
        ) : (
          <BranchesSection onOpenBranch={openBranch} onBook={bookBranch} />
        )}
        <OurFramesSection onTryOn={openTryOnWithFrame} />
        <AboutSocialOptics />
        <FaqSection />
        {branch && branch.slug === 'amirim' && <ContactLocationSection />}
        {branch && branch.slug !== 'amirim' && <BranchLocationSection branch={branch} onOpenBooking={openBooking} />}
        {branch && (
          <BranchesSection onOpenBranch={openBranch} onBook={bookBranch} current={branch} title="הסניפים הנוספים שלנו" />
        )}
      </main>

      <Footer
        onOpenPrivacy={handleOpenPrivacy}
        onOpenTerms={handleOpenTerms}
        onOpenBranch={openBranch}
      />
      <ChatWidget isCampaignPage={false} />

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
    </BranchContext.Provider>
  );
}
