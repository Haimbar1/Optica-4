import React from 'react';
import { MapPin, Calendar, Navigation, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { BRANCHES, Branch, BranchSlug, branchPath, ALL_BRANCH_NAMES } from '../data/branches';
import { HoursGrid } from '../branchContext';

interface BranchesSectionProps {
  onOpenBranch: (slug: BranchSlug) => void;
  onBook: (slug: BranchSlug) => void;
  /** The branch whose page is open — its card is marked and listed last */
  current?: Branch | null;
  title?: string;
}

// "Which branch?" — the three branches as cards: page, booking calendar, navigation.
export const BranchesSection: React.FC<BranchesSectionProps> = ({ onOpenBranch, onBook, current, title }) => {
  const list = current ? BRANCHES.filter((b) => b.slug !== current.slug) : BRANCHES;
  return (
    <section id="branches" className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#0047AB] text-xs font-bold">
            <MapPin className="w-4 h-4" />
            <span>{BRANCHES.length} סניפים: {ALL_BRANCH_NAMES}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-['Rubik'] tracking-tight">
            {title || 'באיזה סניף נוח לכם?'}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            אותם מחירים, אותה בדיקה ואותו שירות בכל הסניפים — לכל סניף יומן תורים משלו.
          </p>
        </div>

        <div className={`grid gap-5 ${list.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-4xl mx-auto'}`}>
          {list.map((b) => {
            const isNew = b.slug !== 'amirim';
            return (
              <div
                key={b.slug}
                id={`branch-card-${b.slug}`}
                className="relative bg-[#FBFBFB] border-2 border-gray-200 hover:border-[#0047AB]/50 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xs transition-colors"
              >
                {isNew && (
                  <span className={`absolute top-4 left-4 inline-flex items-center gap-1 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full ${b.comingSoon ? 'bg-amber-500' : 'bg-[#62B83E]'}`}>
                    <Sparkles className="w-3 h-3" />
                    {b.comingSoon ? 'נפתח בקרוב' : 'סניף חדש'}
                  </span>
                )}
                <div>
                  <span className="text-xs font-bold text-[#0047AB]">האופטיקה החברתית</span>
                  <h3 className="text-2xl font-black text-gray-900 font-['Rubik'] leading-tight">סניף {b.name}</h3>
                </div>

                <div className="space-y-2.5 text-sm text-gray-700 flex-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <span className="block font-extrabold text-gray-900">{b.address || 'הכתובת המדויקת תפורסם בקרוב'}</span>
                      <span className="block text-xs text-gray-500">{b.distanceNote}</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <HoursGrid branch={b} dayClass="font-bold text-gray-800" hoursClass="font-black text-[#0047AB] text-left" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onBook(b.slug)}
                    className="w-full bg-[#0047AB] hover:bg-[#003580] text-white font-black text-sm py-3 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{b.comingSoon && !b.calLink ? `עדכנו אותי בפתיחה ${b.inName}` : `קביעת תור ${b.inName}`}</span>
                  </button>
                  <div className="flex gap-2">
                    <a
                      href={branchPath(b)}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenBranch(b.slug);
                      }}
                      className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <span>לעמוד הסניף</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </a>
                    {b.wazeUrl && (
                      <a
                        href={b.wazeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Waze</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
