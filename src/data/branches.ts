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
  /** WhatsApp, international digits "9725…" */
  whatsapp: string;
  /** Towns the branch serves — written on its page so a search from them finds it */
  nearby: string[];
  /** Region for Google: "גליל עליון" */
  region: string;
  seoTitle: string;
  seoDescription: string;
  /** Not open yet: shown as "נפתח בקרוב", and booking = leave details to hear when it opens */
  comingSoon?: boolean;
}

export const SITE_URL = 'https://optica-4.vercel.app';
export const BRAND_NAME = 'האופטיקה החברתית';

export const BRANCHES: Branch[] = [
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
      { day: 5, from: '10:00', to: '14:00' },
    ],
    phone: '055-250-2584',
    whatsapp: '972545404183',
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
    calLink: 'haoptika-hatova/pardes-hana-30min',
    hours: [
      { day: 2, from: '14:00', to: '20:00' },
      { day: 4, from: '14:00', to: '20:00' },
      { day: 5, from: '09:00', to: '14:00' },
    ],
    phone: '053-279-6290',
    whatsapp: '972503054731',
    nearby: ['פרדס חנה', 'כרכור', 'בנימינה', 'גבעת עדה', 'עין שמר', 'חדרה', 'אור עקיבא', 'קיסריה', 'זכרון יעקב', 'תלמי אלעזר', 'כפר גליקסון'],
    region: 'השרון הצפוני',
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
    calLink: 'haoptika-hatova/shlomi-30min',
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

export const DEFAULT_BRANCH = BRANCHES[0];

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

export const branchWhatsapp = (b: Branch | null) => (b && b.whatsapp) || MAIN_WHATSAPP;
export const branchPhone = (b: Branch | null) => (b && b.phone) || MAIN_PHONE;

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
