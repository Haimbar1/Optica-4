import { BranchHours, DEFAULT_BRANCH, dayName } from '../data/branches';

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

export interface BookingDayOption {
  date: string; // YYYY-MM-DD
  dayName: string; // e.g., 'יום רביעי'
  shortLabel: string; // e.g., 'רביעי'
  formattedDate: string; // e.g., '23 בספטמבר'
  hoursLabel: string; // e.g., '12:00 - 18:00'
  startHourLabel: string; // e.g., 'החל מ-12:00'
  isToday: boolean;
}

/**
 * Returns the earliest available clinic day (Sunday, Wednesday, Thursday, or Friday).
 * If today is a clinic day and within working hours, returns today.
 * Otherwise returns the next earliest clinic day.
 */
export function getFirstAvailableBookingDate(hours: BranchHours[] = DEFAULT_BRANCH.hours): string {
  const options = getUpcomingBookingDays(hours);
  if (options.length > 0) return options[0].date;
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Returns the upcoming 4 clinic days (Sunday, Wednesday, Thursday, Friday) with human-friendly labels.
 */
export function getUpcomingBookingDays(hours: BranchHours[] = DEFAULT_BRANCH.hours): BookingDayOption[] {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  const currentHour = now.getHours();

  // The branch's clinic days (data/branches.ts); a day counts until an hour before it closes
  const clinicDays = hours.map((h) => ({
    dayIndex: h.day,
    name: dayName(h.day),
    short: dayName(h.day).replace(/^יום /, ''),
    hours: `${h.from} - ${h.to}`,
    startHour: `החל מ-${h.from}`,
    endHour: Number(h.to.split(':')[0]) - 1,
  }));

  const results: BookingDayOption[] = [];

  for (const cDay of clinicDays) {
    let daysOffset = (cDay.dayIndex - currentDay + 7) % 7;
    const isToday = daysOffset === 0;

    // If it's today but after the hours, push to next week
    if (isToday && currentHour >= cDay.endHour) {
      daysOffset = 7;
    }

    const d = new Date(now.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const formattedDate = d.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
    });

    results.push({
      date: dateStr,
      dayName: cDay.name,
      shortLabel: cDay.short,
      formattedDate,
      hoursLabel: cDay.hours,
      startHourLabel: cDay.startHour,
      isToday: isToday && currentHour < cDay.endHour,
    });
  }

  // Sort chronologically by date
  results.sort((a, b) => a.date.localeCompare(b.date));

  return results;
}
