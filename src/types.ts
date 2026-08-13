export type FrameMaterial = 'פלסטיק' | 'מתכת' | 'טיטניום' | 'אולטם' | 'ברגים / ללא מסגרת' | 'חצי מסגרת';
export type FrameCategory = 'משקפי ראייה' | 'משקפי שמש' | 'מולטיפוקל' | 'ילדים' | 'מבוגרים';
export type PriceTier = 150 | 200 | 250 | 300;

export interface FrameItem {   
  id: string;
  name: string;
  price: PriceTier;
  category: FrameCategory[];
  material: FrameMaterial;
  colors: string[];
  gender: 'יוניסקס' | 'גברים' | 'נשים' | 'ילדים';
  image: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface AppointmentBooking {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  appointmentType: 'בדיקת ראייה מקיפה (מרחק/קריאה)' | 'התאמת מולטיפוקל' | 'התאמת עדשות מגע מולטיפוקל' | 'איסוף וכיוונון משקפיים';
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status?: 'ממתין לאישור' | 'מאושר' | 'בוטל';
  createdAt?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'כללי' | 'מחירים' | 'בדיקות' | 'איסוף' | 'מולטיפוקל';
  showWazeButton?: boolean;
}

export interface ChatButton {
  id: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  imageUrl?: string;
  buttons?: ChatButton[];
  timestamp: string;
  botType: 'web' | 'whatsapp';
}
