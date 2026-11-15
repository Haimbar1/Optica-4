import React from 'react';
import { Phone, Bot, MessageCircle, Store } from 'lucide-react';
import { Branch, displayPhone, telHref, whatsappLink } from '../data/branches';

interface ContactItem {
  key: string;
  label: string;
  number: string;
  href: string;
  external?: boolean;
  icon: React.ElementType;
  whatsapp?: boolean;
}

/** The branch's own ways to reach it — only those it has (a branch without any gets an empty list). */
export function branchContactItems(b: Branch): ContactItem[] {
  const items: ContactItem[] = [];
  if (b.botPhone) items.push({ key: 'bot', label: 'נועה – קביעה/שינוי תור', number: b.botPhone, href: telHref(b.botPhone), icon: Bot });
  if (b.bookingContact)
    items.push({ key: 'booking', label: `קביעת תור – ${b.bookingContact.name}`, number: b.bookingContact.phone, href: telHref(b.bookingContact.phone), icon: Phone });
  if (b.phone) items.push({ key: 'store', label: b.phoneContact ? `חנות – ${b.phoneContact}` : 'חנות', number: b.phone, href: telHref(b.phone), icon: Store });
  if (b.whatsapp)
    items.push({ key: 'wa', label: 'וואטסאפ', number: displayPhone(b.whatsapp), href: whatsappLink(b), external: true, icon: MessageCircle, whatsapp: true });
  return items;
}

interface BranchContactsProps {
  branch: Branch;
  /** "light" on white cards, "dark" on the blue/dark headers */
  tone?: 'light' | 'dark';
  /** Grid columns from sm up (1 = a list) */
  columns?: 1 | 2 | 4;
  className?: string;
}

// The phones / WhatsApp of a branch as tappable tiles: label on top, number below.
export const BranchContacts: React.FC<BranchContactsProps> = ({ branch, tone = 'light', columns = 2, className = '' }) => {
  const items = branchContactItems(branch);
  if (!items.length) return null;
  const cols = columns === 4 ? 'grid-cols-2 lg:grid-cols-4' : columns === 2 ? 'grid-cols-2' : 'grid-cols-1';
  return (
    <div className={`grid ${cols} gap-1.5 ${className}`}>
      {items.map((it) => {
        const Icon = it.icon;
        const look = it.whatsapp
          ? 'bg-[#25D366] hover:bg-[#1DA851] text-white border-transparent'
          : tone === 'dark'
            ? 'bg-white/10 hover:bg-white/20 text-white border-white/25'
            : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200';
        const sub = it.whatsapp ? 'text-white/85' : tone === 'dark' ? 'text-blue-100' : 'text-gray-500';
        const iconColor = it.whatsapp ? 'text-white' : tone === 'dark' ? 'text-amber-300' : 'text-[#0047AB]';
        return (
          <a
            key={it.key}
            href={it.href}
            target={it.external ? '_blank' : undefined}
            rel={it.external ? 'noopener noreferrer' : undefined}
            className={`flex items-center gap-2 border rounded-xl px-2.5 py-1.5 transition-colors ${look}`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
            <span className="min-w-0 leading-tight">
              <span className={`block text-[10.5px] font-bold truncate ${sub}`}>{it.label}</span>
              <span className="block text-xs font-black" dir="ltr" style={{ textAlign: 'right' }}>{it.number}</span>
            </span>
          </a>
        );
      })}
    </div>
  );
};
