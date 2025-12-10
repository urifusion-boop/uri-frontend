import dayjs from 'dayjs';

export class DateHelper {
  static formatDate(input: string): string {
    // Convert UTC to local timezone first
    const localDate = dayjs.utc(input).local();

    const day = localDate.date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[localDate.month()];
    const year = localDate.year();

    let hours = localDate.hour();
    const minutes = localDate.minute();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12;

    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${day} ${month} ${year} ${hours}:${minutesStr}${ampm}`;
  }

  static convertUTCDateToLocalDate(date: string) {
    const dateObject = new Date(date);

    const localDate = new Date(dateObject.getTime() - dateObject.getTimezoneOffset() * 60 * 1000);
    return localDate.toISOString();
  }

  static isCurrentDateBetween(dateStart: string, dateEnd: string): boolean {
    const currentDate = new Date();
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);

    return currentDate >= startDate && currentDate <= endDate;
  }

  static IsToday(date: string) {
    const day = new Date().getUTCDate();
    const month = new Date().getUTCMonth();
    const year = new Date().getUTCFullYear();

    const jobDay = new Date(date).getUTCDate();
    const jobMonth = new Date(date).getUTCMonth();
    const jobYear = new Date(date).getUTCFullYear();

    return jobMonth === month && jobYear === year && jobDay === day;
  }

  static DaysBetween(dateOne: string, dateTwo: string) {
    if (!dateOne || !dateTwo) return 0;
    const dateA = new Date(dateOne).getUTCDate();
    const dateB = new Date(dateTwo).getUTCDate();

    return Math.abs(dateA - dateB);
  }

  static IsSameDay(day: number, month: number, year: number, date: string) {
    const jobDay = new Date(date).getUTCDate();
    const jobMonth = new Date(date).getUTCMonth();
    const jobYear = new Date(date).getUTCFullYear();

    return jobMonth === month && jobYear === year && jobDay === day;
  }

  static isTodayOrFuture(date: string) {
    const dateObj = new Date(date);
    const today = new Date();
    return dateObj >= today;
  }

  static isTodayOrPast(date: string) {
    const dateObj = new Date(date);
    const today = new Date();
    return dateObj <= today;
  }

  static isFutureDate(date: string) {
    const dateObj = new Date(date);
    const today = new Date();
    return dateObj > today;
  }

  static isPastDate(date: string) {
    const dateObj = new Date(date);
    const today = new Date();
    return dateObj < today;
  }

  static convertTimeTo12HourFormat(timeString: string): string {
    const [hours, minutes] = timeString.split(':').map(Number);

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return formattedTime;
  }

  static generateUnixTimestampRange(until: Date = new Date(), daysToSubtract: number = 700): { since: number; until: number } {
    const now = new Date();
    const since = new Date();

    // Subtract days from the current date
    since.setDate(now.getDate() - daysToSubtract);

    // Ensure until is not in the past
    if (until < since) {
      until = new Date();
    }

    const sinceUnix = Math.floor(since.getTime() / 1000);
    const untilUnix = Math.floor(until.getTime() / 1000);

    return { since: sinceUnix, until: untilUnix };
  }

  static getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  static convertTo12Hour(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const convertedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM case
    return `${convertedHours}:${minutes?.toString().padStart(2, '0')} ${period}`;
  }

  static convertUtcToLocal(utcTime: string): string {
    // const utcDateTime = dayjs.utc(dayjs().format("YYYY-MM-DD") + " " + utcTime);

    // // Convert to local time
    // const localTime = utcDateTime.local().format("YYYY-MM-DD HH:mm:ss");

    return dayjs.utc(utcTime).local().format('YYYY-MM-DD hh:mm A');
  }
}
