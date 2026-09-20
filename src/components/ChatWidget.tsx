import React, { useEffect, useState } from 'react';
import { X, Calendar } from 'lucide-react';

interface ChatWidgetProps {
  isCampaignPage?: boolean;
}

const CAMPAIGN_WELCOME = `אני רואה שהגעת אלינו, לקבוע תור! 👋\nצריך עזרה?`;

const MAIN_WELCOME = `הגעת לאופטיקה החברתית במושב אמירים.\nאנחנו מאמינים שראייה טובה מתחילה מיחס טוב.\n\nלא צריך להתרוצץ - אצלנו תמצא את כל מה שצריך במקום אחד:\n✅ בדיקת ראייה מתקדמת ומדויקת בחינם.\n✅ מבחר עצום של מסגרות בכל סגנון ותקציב.\n✅ שירות אישי וחם, עם התאמה מושלמת לצרכים שלך.\nאפשרויות:\nתיאום תור \nאיך מגיעים אליכם\nעדשות מולטיפוקל \nמהי אופטיקה חברתית\nסוגי מסגרות ומחירים\nמהם מרשמים רגילים\n\nמתי המשקפיים מוכנים`;

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isCampaignPage = false }) => {
  const [showTeaser, setShowTeaser] = useState(false);
  const [isBotWindowOpen, setIsBotWindowOpen] = useState(false);

  // 1. Sync bot widget config and welcome message
  useEffect(() => {
    const targetTitle = isCampaignPage
      ? 'האופטיקה הטובה - קביעת תור'
      : 'האופטיקה הטובה אמירים';
    const targetWelcome = isCampaignPage ? CAMPAIGN_WELCOME : MAIN_WELCOME;

    // Update global config object
    if (typeof window !== 'undefined') {
      (window as any).OpticsBotConfig = {
        botId: 'bot_generic_252',
        title: targetTitle,
        welcomeMessage: targetWelcome,
        whatsappNumber: '972545404183',
        webhookUrl: 'https://n8n.srv1239769.hstgr.cloud/webhook/65325d34-0c9e-4cc3-8b7c-c03c47105b3a'
      };
    }

    const applyUpdate = () => {
      if (typeof (window as any).OpticsBotWidgetUpdate === 'function') {
        (window as any).OpticsBotWidgetUpdate({
          botId: 'bot_generic_252',
          title: targetTitle,
          welcomeMessage: targetWelcome,
          whatsappNumber: '972545404183',
          webhookUrl: 'https://n8n.srv1239769.hstgr.cloud/webhook/65325d34-0c9e-4cc3-8b7c-c03c47105b3a'
        });
        return true;
      }
      return false;
    };

    // Try immediately
    if (!applyUpdate()) {
      // Retry for up to 10 seconds until the bot widget script finishes loading
      const interval = setInterval(() => {
        if (applyUpdate()) {
          clearInterval(interval);
        }
      }, 200);
      const timer = setTimeout(() => clearInterval(interval), 10000);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isCampaignPage]);

  // 2. Observer for checking if bot window is currently open (to hide teaser)
  useEffect(() => {
    const checkState = () => {
      const win = document.getElementById('obw-window') || document.querySelector('.obw-window');
      if (win) {
        const isClosed = win.classList.contains('obw-hidden');
        setIsBotWindowOpen(!isClosed);

        // If on campaign page and the bot window is open, make sure the opening message is clean
        if (isCampaignPage && !isClosed) {
          const firstMsg = document.querySelector('#obw-messages .obw-msg:first-child');
          if (firstMsg) {
            const bubble = firstMsg.querySelector('.obw-msg-bubble') || firstMsg;
            // If the message still shows old generic list with "עדשות מולטיפוקל" or similar, clean it up
            if (bubble.textContent && !bubble.textContent.includes('אני רואה שהגעת אלינו, לקבוע תור!')) {
              bubble.textContent = CAMPAIGN_WELCOME;
              // Remove any buttons rendered in that first message
              const buttons = firstMsg.querySelectorAll('.obw-btn-action, .obw-btn-link');
              buttons.forEach((b) => b.remove());
            }
          }
        }
      }
    };

    const interval = setInterval(checkState, 300);
    return () => clearInterval(interval);
  }, [isCampaignPage]);

  // 3. Auto-open based on URL parameter or hash
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hasChatFlag =
      searchParams.has('chat') ||
      searchParams.has('bot') ||
      searchParams.has('open') ||
      searchParams.has('chatbot');

    const chatVal = (
      searchParams.get('chat') ||
      searchParams.get('bot') ||
      searchParams.get('open') ||
      searchParams.get('chatbot') ||
      ''
    ).toLowerCase();

    const isHashOpen = window.location.hash === '#chat' || window.location.hash === '#bot';

    const shouldAutoOpen =
      isHashOpen ||
      (hasChatFlag &&
        (chatVal === '' || ['open', 'true', '1', 'yes', 'bot', 'chat'].includes(chatVal)));

    if (shouldAutoOpen) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const fab = document.getElementById('obw-fab') || document.querySelector('.obw-fab-button');
        const win = document.getElementById('obw-window') || document.querySelector('.obw-window');

        if (fab) {
          if (win && win.classList.contains('obw-hidden')) {
            (fab as HTMLElement).click();
          } else if (!win) {
            (fab as HTMLElement).click();
          }
          clearInterval(interval);
        } else if (attempts >= 50) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  // 4. Proactive teaser bubble for campaign landing page
  useEffect(() => {
    if (!isCampaignPage) {
      setShowTeaser(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowTeaser(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isCampaignPage]);

  const handleOpenBot = () => {
    const fab = document.getElementById('obw-fab') || document.querySelector('.obw-fab-button');
    if (fab) {
      (fab as HTMLElement).click();
    }
    setShowTeaser(false);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (!isCampaignPage || !showTeaser || isBotWindowOpen || isMobile) {
    return null;
  }

  return (
    <div
      id="campaign-bot-teaser"
      className="fixed bottom-[88px] right-4 sm:bottom-6 sm:right-[92px] z-[999998] max-w-[280px] bg-white border-2 border-[#0047AB] rounded-2xl p-3.5 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-3 duration-300 font-['Rubik',sans-serif] text-right cursor-pointer group"
      onClick={handleOpenBot}
      role="button"
      tabIndex={0}
      aria-label="פתח בוט קביעת תור"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowTeaser(false);
        }}
        className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-slate-800 text-white hover:bg-slate-950 rounded-full flex items-center justify-center text-xs shadow-md transition-colors cursor-pointer"
        aria-label="סגור הודעה"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-[#0047AB] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:scale-105 transition-transform">
          <Calendar className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
            אני רואה שהגעת אלינו, לקבוע תור! 👋
          </p>
          <p className="text-xs font-bold text-[#0047AB]">
            צריך עזרה?
          </p>
        </div>
      </div>
    </div>
  );
};
