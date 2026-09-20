import React, { useState, useMemo } from 'react';
import { FAQ_ITEMS } from '../data/opticsData';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, Navigation, ExternalLink } from 'lucide-react';
import { BUSINESS_INFO } from '../data/opticsData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_ITEMS;
    const q = searchQuery.toLowerCase();
    return FAQ_ITEMS.filter(
      (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <section id="faq" className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#0047AB] text-xs font-bold">
            <HelpCircle className="w-4 h-4 text-[#0047AB]" />
            <span>כל מה שרציתם לדעת</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-['Rubik'] tracking-tight">
            שאלות ותשובות נפוצות
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            תשובות מפורטות לגבי בדיקות ראייה, סוגי מסגרות, תהליך האיסוף והתמחור החברתי.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="חפש שאלה או נושא (למשל: מולטיפוקל, איסוף, וויז...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0047AB] text-sm text-gray-800 bg-[#FBFBFB]"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-3" />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              לא נמצאו שאלות תואמות לחיפוש.
            </div>
          ) : (
            filteredFaqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#FBFBFB] rounded-2xl border border-gray-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-right p-5 flex items-center justify-between gap-4 font-extrabold text-base text-gray-900 hover:text-[#0047AB] transition-colors"
                  >
                    <span className="font-['Rubik']">{item.question}</span>
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 text-gray-600">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#0047AB]" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-gray-700 leading-relaxed border-t border-gray-200 pt-3 space-y-3 animate-in fade-in">
                      <p>{item.answer}</p>
                      {item.showWazeButton && (
                        <div className="pt-1">
                          <a
                            href={BUSINESS_INFO.wazeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0047AB] hover:bg-[#003580] text-white font-bold rounded-xl shadow-xs transition-colors text-xs sm:text-sm"
                          >
                            <Navigation className="w-4 h-4 fill-white text-white" />
                            <span>ניווט ישיר ב-Waze (וויז)</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Direct Help Banner */}
        <div className="mt-10 p-5 bg-[#E8F0FE] border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div>
            <h4 className="font-extrabold text-sm text-[#0047AB]">לא מצאתם תשובה לשאלה שלכם?</h4>
            <p className="text-xs text-gray-700 mt-0.5">צביקה ואביגיל זמינים לשאלות נוספות בוואטסאפ ובטלפון</p>
          </div>
          <a
            href={BUSINESS_INFO.whatsappDirectZvika}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1DA851] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>לחץ למעבר לוואטסאפ 📱</span>
          </a>
        </div>
      </div>
    </section>
  );
};
