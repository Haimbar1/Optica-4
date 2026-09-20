/**
 * Israeli Phone Number Validation & Formatting Utility
 *
 * Validates:
 * 1. Mobile numbers: 050, 051, 052, 053, 054, 055, 056, 058, 059 (10 digits)
 * 2. Landline numbers: 02, 03, 04, 08, 09 (9 digits)
 * 3. VoIP numbers: 072, 073, 074, 076, 077, 078, 079 (10 digits)
 * 4. International prefix representations (+972, 972, 00972)
 */

export function normalizeIsraeliPhone(rawPhone: string): string {
  if (!rawPhone) return '';
  let cleaned = rawPhone.trim().replace(/[\s\-().]/g, '');

  if (cleaned.startsWith('+972')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('00972')) {
    cleaned = '0' + cleaned.slice(5);
  } else if (cleaned.startsWith('972') && cleaned.length >= 11) {
    cleaned = '0' + cleaned.slice(3);
  }

  return cleaned;
}

export function isValidIsraeliPhone(rawPhone: string): boolean {
  if (!rawPhone) return false;
  const cleaned = normalizeIsraeliPhone(rawPhone);

  if (!/^\d+$/.test(cleaned)) {
    return false;
  }

  // Mobile: 050-059 (10 digits)
  const isMobile = /^05\d{8}$/.test(cleaned);

  // VoIP: 072-079 (10 digits)
  const isVoip = /^07[2-9]\d{7}$/.test(cleaned);

  // Landline: 02, 03, 04, 08, 09 (9 digits)
  const isLandline = /^0[23489]\d{7}$/.test(cleaned);

  return isMobile || isVoip || isLandline;
}

/**
 * Returns a human-friendly error message in Hebrew if invalid, or null if valid.
 */
export function getIsraeliPhoneValidationError(rawPhone: string): string | null {
  const trimmed = rawPhone.trim();
  if (!trimmed) {
    return 'נא להזין מספר טלפון ליצירת קשר';
  }

  const cleaned = normalizeIsraeliPhone(trimmed);

  if (!/^\d+$/.test(cleaned)) {
    return 'מספר הטלפון יכול להכיל ספרות ומקפים בלבד';
  }

  if (cleaned.startsWith('05')) {
    if (cleaned.length < 10) {
      return `מספר נייד קצר מדי (${cleaned.length}/10 ספרות). נא להזין מספר מלא`;
    }
    if (cleaned.length > 10) {
      return `מספר נייד ארוך מדי (${cleaned.length}/10 ספרות). מספר נייד מכיל 10 ספרות`;
    }
    return null;
  }

  if (cleaned.startsWith('07')) {
    if (cleaned.length !== 10) {
      return 'מספר קווי/VoIP צריך להכיל 10 ספרות (לדוגמה: 077-1234567)';
    }
    return null;
  }

  if (/^0[23489]/.test(cleaned)) {
    if (cleaned.length < 9) {
      return `מספר טלפון קווי קצר מדי (${cleaned.length}/9 ספרות). נא להזין 9 ספרות`;
    }
    if (cleaned.length > 9) {
      return `מספר טלפון קווי ארוך מדי (${cleaned.length}/9 ספרות). טלפון קווי מכיל 9 ספרות`;
    }
    return null;
  }

  if (!cleaned.startsWith('0')) {
    return 'מספר ישראלי חייב להתחיל בספרה 0 (למשל: 050 או 04) או בקידומת 972+';
  }

  return 'מספר טלפון אינו תקין בישראל (לדוגמה: 050-1234567 או 04-1234567)';
}

/**
 * Standardizes format for sending/display (e.g. 050-1234567)
 */
export function formatIsraeliPhone(rawPhone: string): string {
  const cleaned = normalizeIsraeliPhone(rawPhone);
  if (/^05\d{8}$/.test(cleaned)) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  if (/^07\d{8}$/.test(cleaned)) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  if (/^0[23489]\d{7}$/.test(cleaned)) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
  }
  return cleaned;
}
