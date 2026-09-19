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
 * Returns the earliest available clinic day (Wednesday, Thursday, or Friday).
 * If today is a clinic day and within working hours, returns today.
 * Otherwise returns the next earliest clinic day.
 */
export function getFirstAvailableBookingDate(): string {
  const options = getUpcomingBookingDays();
  return options.length > 0 ? options[0].date : getNextWednesdayDate();
}

/**
 * Returns the upcoming 3 clinic days (Wednesday, Thursday, Friday) with human-friendly labels.
 */
export function getUpcomingBookingDays(): BookingDayOption[] {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  const currentHour = now.getHours();

  // Clinic schedule:
  // Wednesday (3): 12:00 - 18:00
  // Thursday (4): 12:00 - 18:00
  // Friday (5): 10:00 - 14:00

  const clinicDays = [
    { dayIndex: 3, name: 'יום רביעי', short: 'רביעי', hours: '12:00 - 18:00', startHour: 'החל מ-12:00', endHour: 17 },
    { dayIndex: 4, name: 'יום חמישי', short: 'חמישי', hours: '12:00 - 18:00', startHour: 'החל מ-12:00', endHour: 17 },
    { dayIndex: 5, name: 'יום שישי', short: 'שישי', hours: '10:00 - 14:00', startHour: 'החל מ-10:00', endHour: 13 },
  ];

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
