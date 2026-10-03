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
// בהמשך הרשימה הזו תגיע ממסך ההגדרות (העלאת תמונות של מסגרות אמיתיות מהחנות).
export interface TryOnFrame {
  id: string;
  name: string;
  style: string;
  price: number;
  image: string;
}

export const TRY_ON_FRAMES: TryOnFrame[] = [
  { id: 'rect-black', name: 'קלאסי שחור', style: 'מלבני', price: 150, image: rectBlack },
  { id: 'round-gold', name: 'עגול זהב', style: 'מתכת דקה', price: 200, image: roundGold },
  { id: 'cateye-burgundy', name: 'חתולי בורדו', style: 'קאט-איי', price: 200, image: catEyeBurgundy },
  { id: 'tortoise', name: 'צב חום', style: 'וייפרר', price: 150, image: tortoise },
  { id: 'browline-navy', name: 'כחול נייבי', style: 'חצי מסגרת', price: 250, image: browlineNavy },
  { id: 'crystal-clear', name: 'קריסטל שקוף', style: 'שקוף', price: 150, image: crystalClear },
  { id: 'aviator-sun', name: 'טייסים', style: 'משקפי שמש', price: 250, image: aviatorSun },
  { id: 'kids-teal', name: 'ילדים טורקיז', style: 'ילדים', price: 150, image: kidsTeal },
];
