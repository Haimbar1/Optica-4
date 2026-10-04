import rectBlack from '../assets/tryon/rect-black.svg';
import roundGold from '../assets/tryon/round-gold.svg';
import catEyeBurgundy from '../assets/tryon/cateye-burgundy.svg';
import aviatorSun from '../assets/tryon/aviator-sun.svg';
import crystalClear from '../assets/tryon/crystal-clear.svg';
import tortoise from '../assets/tryon/tortoise.svg';
import browlineNavy from '../assets/tryon/browline-navy.svg';
import kidsTeal from '../assets/tryon/kids-teal.svg';

// מסגרת להדמיה: התמונה חייבת להיות חזית המשקפיים על רקע שקוף (PNG/SVG),
// חתוכה צמוד לקצוות המסגרת, כשהעדשות ממורכזות לגובה.
// aspect – יחס רוחב/גובה של התמונה (ברירת מחדל 320/120 של מסגרות הדוגמה).
// hingeY – גובה הציר (חיבור הידית) בתמונה, ביחידות של 0–120 מגובה התמונה.
// templeColor – צבע הידיות שמצוירות מהציר עד האוזן.
// מסגרות אמיתיות מועלות בפורטל (portal.smartesek.com ← אתר); כשיש כאלה, הן מחליפות את מסגרות הדוגמה.
export interface TryOnFrame {
  id: string;
  name: string;
  style: string;
  price: number;
  image: string;
  aspect?: number;
  hingeY: number;
  templeColor: string;
}

export const TRY_ON_FRAMES: TryOnFrame[] = [
  { id: 'rect-black', name: 'קלאסי שחור', style: 'מלבני', price: 150, image: rectBlack, hingeY: 36.5, templeColor: '#141414' },
  { id: 'round-gold', name: 'עגול זהב', style: 'מתכת דקה', price: 200, image: roundGold, hingeY: 46, templeColor: '#b8913f' },
  { id: 'cateye-burgundy', name: 'חתולי בורדו', style: 'קאט-איי', price: 200, image: catEyeBurgundy, hingeY: 28, templeColor: '#7a1c2e' },
  { id: 'tortoise', name: 'צב חום', style: 'וייפרר', price: 150, image: tortoise, hingeY: 35, templeColor: '#6b3a14' },
  { id: 'browline-navy', name: 'כחול נייבי', style: 'חצי מסגרת', price: 250, image: browlineNavy, hingeY: 35, templeColor: '#1e2f5c' },
  { id: 'crystal-clear', name: 'קריסטל שקוף', style: 'שקוף', price: 150, image: crystalClear, hingeY: 36.5, templeColor: 'rgba(200, 214, 228, 0.9)' },
  { id: 'aviator-sun', name: 'טייסים', style: 'משקפי שמש', price: 250, image: aviatorSun, hingeY: 32, templeColor: '#b8bcc4' },
  { id: 'kids-teal', name: 'ילדים טורקיז', style: 'ילדים', price: 150, image: kidsTeal, hingeY: 49, templeColor: '#ec4899' },
];
