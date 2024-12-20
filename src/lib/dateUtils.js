import { DateTime } from 'luxon';

/**
 * Convert a date to a specific timezone.
 * @param {string} date - The date to convert (e.g., '2024-12-25T12:00:00').
 * @param {string} timeZone - The target time zone (e.g., 'America/New_York').
 * @returns {string} - The converted date.
 */
export const convertTimeZone = (date, timeZone) => {
  const dt = DateTime.fromISO(date).setZone(timeZone);
  return dt.toLocaleString(DateTime.DATETIME_MED); // Customize as needed
};

/**
 * Add or subtract a specified duration from a date.
 * @param {string} date - The starting date (e.g., '2024-12-25T12:00:00').
 * @param {object} duration - Duration object (e.g., { days: 5, hours: 2 }).
 * @returns {string} - The modified date.
 */
export const adjustDate = (date, duration) => {
  const dt = DateTime.fromISO(date);
  const adjustedDate = dt.plus(duration); // Use .minus() to subtract
  return adjustedDate.toISO(); // Adjust this for different formats
};
