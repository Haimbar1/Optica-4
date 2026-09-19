/**
 * Calculates the next upcoming Wednesday in YYYY-MM-DD format.
 * If today is Wednesday and before 18:00, it returns today.
 * If today is Wednesday after 18:00 or any other day, it returns the next upcoming Wednesday.
 */
export function getNextWednesdayDate(): string {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  
  // Calculate days until Wednesday (target day index = 3)
  let daysUntilWednesday = (3 - currentDay + 7) % 7;
  
  // If today is Wednesday, check if appointment hours have ended (18:00)
  if (daysUntilWednesday === 0 && now.getHours() >= 18) {
    daysUntilWednesday = 7;
  }

  const targetDate = new Date(now.getTime() + daysUntilWednesday * 24 * 60 * 60 * 1000);
  
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export function formatHebrewDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
