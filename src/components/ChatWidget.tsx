import React, { useEffect } from 'react';

/**
 * ChatWidget component
 * The actual chat widget is embedded directly in index.html via:
 * <script src="https://app.smartesek.com/bot-widget.js" data-bot-id="bot_generic_252" data-title="האופטיקה הטובה אמירים" async></script>
 *
 * This component handles URL parameters (e.g. ?chat=open or ?bot=1) to auto-open the bot window when requested.
 */
export const ChatWidget: React.FC = () => {
  useEffect(() => {
    // Check URL parameters or hash for opening the bot
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
      hasChatFlag && (
        chatVal === '' || 
        ['open', 'true', '1', 'yes', 'bot', 'chat'].includes(chatVal)
      );

    if (shouldAutoOpen) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const fab = document.getElementById('obw-fab') || document.querySelector('.obw-fab-button');
        const win = document.getElementById('obw-window') || document.querySelector('.obw-window');

        if (fab) {
          // If window is closed, click the FAB to open
          if (win && win.classList.contains('obw-hidden')) {
            (fab as HTMLElement).click();
          } else if (!win) {
            (fab as HTMLElement).click();
          }
          clearInterval(interval);
        } else if (attempts >= 50) { // Timeout after 5 seconds
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  return null;
};
