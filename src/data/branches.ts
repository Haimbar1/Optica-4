// The optics' branches. Every page, button and form that shows an address, hours, a phone or the
// booking calendar reads it from here — add a branch here, not as new hardcoded text in a component.
//
// A field left empty (address, calLink, hours, phone, whatsapp) is simply not shown: the site then
// says "בתיאום מראש" / "נחזור אליכם" for that branch instead of inventing a detail.
//
// This file is also read by vite.config.ts (to write each branch's own HTML head for Google /
// Facebook / WhatsApp previews) — keep it plain data, with no imports.

export type BranchSlug = 'amirim' | 'pardes-hanna' | 'shlomi';

/** One opening window: day 0 = Sunday … 5 = Friday, times "HH:MM". */
export interface BranchHours {
  day: number;
  from: string;
  to: string;
}

export interface Branch {
  slug: BranchSlug;
  /** Short name: "אמירים" */
  name: string;
  /** "באמירים" / "בפרדס חנה-כרכור" */
  inName: string;
  /** Street address — empty = not published yet */
  address: string;
  /** A line under the address: area, parking */
  areaNote: string;
  /** How far from the nearby cities, for the booking page */
  distanceNote: string;
  wazeUrl: string;
  /** For the map and Google's structured data */
  geo?: { lat: number; lng: number };
  /** The branch's own Cal.com event: "<user>/<event>" — empty = no online calendar yet */
  calLink: string;
  hours: BranchHours[];
  /** The store's phone, "055-250-2584" */
  phone: string;
  /** Who answers the store phone: "סמדר" — shown next to it */
  phoneContact?: string;
  /** WhatsApp, international digits "9725…" */
  whatsapp: string;
  /** Phone answered by the booking bot (Noa) — books or changes appointments. Empty = none */
  botPhone?: string;
  /** A person who books appointments by phone */
  bookingContact?: { name: string; phone: string };
  /** Towns the branch serves — written on its page so a search from them finds it */
  nearby: string[];
  /** Region for Google: "גליל עליון" */
  region: string;
  seoTitle: string;
  seoDescription: string;
  /** Not open yet: shown as "נפתח בקרוב", and booking = leave details to hear when it opens */
  comingSoon?: boolean;
  /** Opening day "YYYY-MM-DD": the site's booking days start from it, not from today */
  opensOn?: string;
  /** The branch's own web chat bot (Smartesek). Left out = the main bot (DEFAULT_WEB_BOT) */
  webBot?: WebBot;
}

export interface WebBot {
  botId: string;
  title: string;
  welcomeMessage: string;
}

/** The main web bot — אמירים, and every page that isn't a branch with a bot of its own */
export const DEFAULT_WEB_BOT: WebBot = {
  botId: 'bot_generic_252',
  title: 'האופטיקה החברתית אמירים',
  welcomeMessage:
    'הגעת לאופטיקה החברתית במושב אמירים.\nאנחנו מאמינים שראייה טובה מתחילה מיחס טוב.\n\nלא צריך להתרוצץ - אצלנו תמצא את כל מה שצריך במקום אחד:\n✅ בדיקת ראייה מתקדמת ומדויקת בחינם.\n✅ מבחר עצום של מסגרות בכל סגנון ותקציב.\n✅ שירות אישי וחם, עם התאמה מושלמת לצרכים שלך.\nאפשרויות:\nתיאום תור \nאיך מגיעים אליכם\nעדשות מולטיפוקל \nמהי אופטיקה חברתית\nסוגי מסגרות ומחירים\nמהם מרשמים רגילים\n\nמתי המשקפיים מוכנים',
};

/** The n8n webhook every web bot talks to (it answers by the bot_id it gets) */
export const WEB_BOT_WEBHOOK = 'https://n8n.srv1239769.hstgr.cloud/webhook/65325d34-0c9e-4cc3-8b7c-c03c47105b3a';

export const SITE_URL = 'https://optica-4.vercel.app';
export const BRAND_NAME = 'האופטיקה החברתית';

// ─── Turning a branch off / on ───────────────────────────────────────────────────────────────
// A branch listed here is taken off the whole site: its page, cards, booking picker, structured
// data and the AI bot's answers. Its details below stay as they are — to bring it back, just
// delete its slug from this list (or empty the list) and redeploy.
export const HIDDEN_BRANCHES: BranchSlug[] = ['shlomi'];

/** Every branch, shown or hidden. The site reads BRANCHES (only the shown ones). */
export const ALL_BRANCHES: Branch[] = [
  {
    slug: 'amirim',
    name: 'אמירים',
    inName: 'באמירים',
    address: 'מצפה מנחם 86, אמירים',
    areaNote: 'מושב אמירים, מועצה אזורית מרום הגליל (גליל עליון) • חניה חופשית במקום',
    distanceNote: "15 דק' מכרמיאל, 20 דק' מצפת",
    wazeUrl: 'https://waze.com/ul?ll=32.936389,35.454517&navigate=yes',
    geo: { lat: 32.936389, lng: 35.454517 },
    calLink: 'haoptika-hatova/30min',
    hours: [
      { day: 0, from: '10:00', to: '15:00' },
      { day: 3, from: '12:00', to: '18:00' },
      { day: 4, from: '12:00', to: '18:00' },
    ],
    phone: '055-250-2584',
    whatsapp: '972545404183',
    botPhone: '04-376-3118',
    bookingContact: { name: 'חנה', phone: '054-913-1704' },
    nearby: ['כרמיאל', 'צפת', 'ראש פינה', 'חצור הגלילית', 'מירון', 'ספסופה', 'כפר שמאי', 'פקיעין', 'מגדל תפן', 'מרום הגליל'],
    region: 'גליל עליון',
    seoTitle: 'האופטיקה החברתית אמירים | בדיקת ראייה ומשקפיים ב-150 ₪ ליד כרמיאל וצפת',
    seoDescription:
      'האופטיקה החברתית במצפה מנחם 86, אמירים: בדיקת ראייה חינם, משקפי ראייה מלאים ב-150 ₪ ועדשות מולטיפוקל מ-800 ₪. 15 דקות מכרמיאל, 20 דקות מצפת. קביעת תור ביומן.',
  },
  {
    slug: 'pardes-hanna',
    name: 'פרדס חנה-כרכור',
    inName: 'בפרדס חנה-כרכור',
    address: 'נחלה 6, מרכז "שדות", כרכור',
    areaNote: 'מרכז "שדות", כרכור – פרדס חנה-כרכור',
    distanceNote: 'ליד בנימינה, חדרה וזכרון יעקב',
    wazeUrl: `https://waze.com/ul?q=${encodeURIComponent('נחלה 6 כרכור')}&navigate=yes`,
    // Opens Tuesday 24.11.2026 — the site offers days from then (opensOn) and the calendar opens on it.
    // Cal.com's own availability for this event must also start on 24.11 (date overrides there).
    calLink: 'haoptika-hatova/pardes-hana-30min',
    opensOn: '2026-11-24',
    hours: [
      { day: 0, from: '15:00', to: '20:00' },
      { day: 2, from: '15:00', to: '20:00' },
      { day: 4, from: '12:00', to: '18:00' },
    ],
    phone: '053-279-6290',
    phoneContact: 'סמדר',
    whatsapp: '972503054731',
    nearby: ['פרדס חנה', 'כרכור', 'בנימינה', 'גבעת עדה', 'עין שמר', 'חדרה', 'אור עקיבא', 'קיסריה', 'זכרון יעקב', 'תלמי אלעזר', 'כפר גליקסון'],
    region: 'השרון הצפוני',
    webBot: {
      botId: 'bot_485265',
      title: 'האופטיקה החברתית פרדס חנה-כרכור',
      welcomeMessage:
        'הגעת לאופטיקה החברתית בפרדס חנה-כרכור (נחלה 6, מרכז "שדות", כרכור).\nאנחנו מאמינים שראייה טובה מתחילה מיחס טוב.\n\nלא צריך להתרוצץ - אצלנו תמצא את כל מה שצריך במקום אחד:\n✅ בדיקת ראייה מתקדמת ומדויקת בחינם.\n✅ מבחר עצום של מסגרות בכל סגנון ותקציב.\n✅ שירות אישי וחם, עם התאמה מושלמת לצרכים שלך.\nאפשרויות:\nתיאום תור \nאיך מגיעים אליכם\nעדשות מולטיפוקל \nמהי אופטיקה חברתית\nסוגי מסגרות ומחירים\nמהם מרשמים רגילים\n\nמתי המשקפיים מוכנים',
    },
    seoTitle: 'האופטיקה החברתית פרדס חנה-כרכור | בדיקת ראייה ומשקפיים ב-150 ₪',
    seoDescription:
      'סניף חדש של האופטיקה החברתית בנחלה 6, מרכז "שדות" כרכור: בדיקת ראייה חינם ע"י אופטומטריסט מוסמך, משקפי ראייה מלאים ב-150 ₪ ועדשות מולטיפוקל מ-800 ₪. ליד בנימינה, חדרה וזכרון יעקב. קביעת תור ביומן.',
  },
  {
    slug: 'shlomi',
    name: 'שלומי',
    inName: 'בשלומי',
    address: 'שלומי סנטר, דרך סנדי אזולאי 107, שלומי',
    areaNote: 'מרכז מסחרי שלומי סנטר, הגליל המערבי',
    distanceNote: 'ליד נהריה, מעלות ומצובה',
    wazeUrl: 'https://www.waze.com/he/live-map/directions/%D7%9E%D7%A8%D7%9B%D7%96-%D7%9E%D7%A1%D7%97%D7%A8%D7%99-%D7%A9%D7%9C%D7%95%D7%9E%D7%99-%D7%A1%D7%A0%D7%98%D7%A8?to=place.w.23003467.230362348.289278',
    // Online booking is closed until the branch opens. To open it: put back
    // calLink: 'haoptika-hatova/shlomi-30min' and remove comingSoon below.
    calLink: '',
    hours: [],
    phone: '',
    whatsapp: '',
    nearby: ['שלומי', 'נהריה', 'מעלות-תרשיחא', 'מצובה', 'בצת', 'חניתה', 'אילון', 'גורן', 'כפר ורדים', 'מטה אשר'],
    region: 'הגליל המערבי',
    comingSoon: true,
    seoTitle: 'האופטיקה החברתית שלומי – נפתח בקרוב | בדיקת ראייה ומשקפיים ב-150 ₪ ליד נהריה',
    seoDescription:
      'סניף חדש של האופטיקה החברתית נפתח בקרוב בשלומי סנטר: בדיקת ראייה חינם ע"י אופטומטריסט מוסמך, משקפי ראייה מלאים ב-150 ₪ ועדשות מולטיפוקל מ-800 ₪. ליד נהריה ומעלות. קביעת תור ביומן.',
  },
];

export const BRANCHES: Branch[] = ALL_BRANCHES.filter((b) => !HIDDEN_BRANCHES.includes(b.slug));

export const DEFAULT_BRANCH = BRANCHES[0];

/** More than one branch on the site — else branch pickers and "our branches" lists are left out. */
export const MULTI_BRANCH = BRANCHES.length > 1;

/** The phone / WhatsApp the brand uses when a branch has none of its own yet. */
export const MAIN_WHATSAPP = '972545404183';
export const MAIN_PHONE = '055-250-2584';

export function branchBySlug(slug: string | null | undefined): Branch | null {
  if (!slug) return null;
  const s = slug.toLowerCase().replace(/^\/+|\/+$/g, '');
  return BRANCHES.find((b) => b.slug === s) || null;
}

/** All branch names joined: "אמירים, פרדס חנה-כרכור ושלומי" */
export const ALL_BRANCH_NAMES = BRANCHES.map((b) => b.name).reduce(
  (acc, n, i, arr) => (i === 0 ? n : i === arr.length - 1 ? `${acc} ו${n}` : `${acc}, ${n}`),
  '',
);

/** "3 סניפים: אמירים, פרדס חנה-כרכור ושלומי" — or just the address when there is one branch */
export const BRANCHES_SUMMARY = MULTI_BRANCH ? `${BRANCHES.length} סניפים: ${ALL_BRANCH_NAMES}` : DEFAULT_BRANCH.address;

/** The page of a branch: "/pardes-hanna" */
export const branchPath = (b: Branch) => `/${b.slug}`;

const DAY_LETTERS = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];
const DAY_NAMES = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת'];
export const dayName = (d: number) => DAY_NAMES[d] || '';

/** Hours grouped for display: [{ days: "ד', ה'", hours: "12:00-18:00" }, …] */
export function hoursRows(b: Branch): { days: string; hours: string }[] {
  const rows: { days: number[]; hours: string }[] = [];
  [...b.hours]
    .sort((a, c) => a.day - c.day)
    .forEach((h) => {
      const hours = `${h.from}-${h.to}`;
      const same = rows.find((r) => r.hours === hours);
      if (same) same.days.push(h.day);
      else rows.push({ days: [h.day], hours });
    });
  return rows.map((r) => ({
    days: r.days.length === 1 ? `יום ${DAY_LETTERS[r.days[0]]}` : r.days.map((d) => DAY_LETTERS[d]).join(', '),
    hours: r.hours,
  }));
}

/** The web bot for a page: the branch's own, else the main one */
export const webBotFor = (b: Branch | null): WebBot => (b && b.webBot) || DEFAULT_WEB_BOT;

export const branchWhatsapp = (b: Branch | null) => (b && b.whatsapp) || MAIN_WHATSAPP;
export const branchPhone = (b: Branch | null) => (b && b.phone) || MAIN_PHONE;

/** "tel:0549131704" */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/** wa.me link; a branch without its own number gets a first line naming the branch. */
export function whatsappLink(b: Branch | null, text?: string): string {
  const own = !!(b && b.whatsapp);
  const msg = text || (b && !own ? `שלום, אשמח לפרטים על סניף ${b.name}` : '');
  return `https://wa.me/${branchWhatsapp(b)}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
}

/** "054-540-4183" from "972545404183" */
export function displayPhone(intl: string): string {
  const local = intl.replace(/^972/, '0');
  return local.length === 10 ? `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}` : local;
}

/** Google Maps embed for the branch (by its coordinates, else its address, else the town). */
export function mapEmbedUrl(b: Branch): string {
  const q = b.geo ? `${b.geo.lat},${b.geo.lng}` : b.address || b.name;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&hl=iw&z=15&output=embed`;
}

/** schema.org Optician for the branch — Google's local results read this. */
export function branchJsonLd(b: Branch): Record<string, unknown> {
  const url = `${SITE_URL}${branchPath(b)}`;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return {
    '@context': 'https://schema.org',
    '@type': 'Optician',
    '@id': `${url}#branch`,
    name: `${BRAND_NAME} ${b.name}`,
    url,
    image: `${SITE_URL}/og-image.jpg`,
    priceRange: '₪150-₪1200',
    ...(b.phone ? { telephone: b.phone } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(b.address ? { streetAddress: b.address } : {}),
      addressLocality: b.name,
      addressRegion: b.region,
      addressCountry: 'IL',
    },
    ...(b.geo ? { geo: { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng } } : {}),
    ...(b.hours.length
      ? {
          openingHoursSpecification: b.hours.map((h) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: days[h.day],
            opens: h.from,
            closes: h.to,
          })),
        }
      : {}),
    areaServed: b.nearby.map((n) => ({ '@type': 'City', name: n })),
    parentOrganization: { '@type': 'Organization', name: BRAND_NAME, url: SITE_URL },
  };
}
