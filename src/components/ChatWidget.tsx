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
    // Handle ?chat=open or ?bot=1 URL parameter to automatically open the widget if present
    const searchParams = new URLSearchParams(window.location.search);
    const chatParam = searchParams.get('chat') || searchParams.get('Chat') || searchParams.get('bot') || searchParams.get('open');
    
    if (chatParam && ['open', 'true', '1'].includes(chatParam.toLowerCase())) {
      const timer = setTimeout(() => {
        const fab = document.getElementById('obw-fab');
        const win = document.getElementById('obw-window');
        if (fab && win && win.classList.contains('obw-hidden')) {
          fab.click();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  return null;
};
