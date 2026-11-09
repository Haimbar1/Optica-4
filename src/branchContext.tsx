import React, { createContext, useContext } from 'react';
import { Branch, DEFAULT_BRANCH, hoursRows } from './data/branches';

// The branch whose page is open: null = the home page (all branches).
export const BranchContext = createContext<Branch | null>(null);

export const useBranch = () => useContext(BranchContext);

/** For something that must show one branch's details: the open branch, else אמירים. */
export const useBranchOrDefault = () => useContext(BranchContext) || DEFAULT_BRANCH;

/** A branch's opening hours as a two-column grid; "בתיאום מראש" when it has none yet. */
export const HoursGrid: React.FC<{
  branch: Branch;
  dayClass?: string;
  hoursClass?: string;
  className?: string;
}> = ({ branch, dayClass = 'font-bold', hoursClass = 'font-black text-left', className = '' }) => {
  const rows = hoursRows(branch);
  if (!rows.length) return <span className={dayClass}>שעות הפעילות יפורסמו בקרוב · בתיאום מראש</span>;
  return (
    <div className={`grid grid-cols-[max-content_auto] items-center gap-x-2.5 gap-y-0.5 leading-tight ${className}`}>
      {rows.map((r) => (
        <React.Fragment key={r.days}>
          <span className={dayClass}>{r.days}:</span>
          <span dir="ltr" className={hoursClass}>{r.hours}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

/** Hours in one line: "א' 10:00-15:00 | ד', ה' 12:00-18:00" */
export const hoursInline = (branch: Branch) =>
  hoursRows(branch).map((r) => `${r.days.replace(/^יום /, '')} ${r.hours}`).join(' | ');
