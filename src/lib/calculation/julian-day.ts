/**
 * Julian Day and time conversion utilities
 *
 * Julian Day is a continuous count of days since the beginning of the Julian Period
 * (January 1, 4713 BC in the Julian calendar). It's the standard time reference for
 * astronomical calculations.
 */

import sweph from 'sweph';
import { InvalidBirthDataError } from './types';

const { constants, utc_to_jd, jdut1_to_utc, deltat } = sweph;

// ============================================================================
// Julian Day Conversion
// ============================================================================

/**
 * Convert a UTC date/time to Julian Day
 *
 * @param year - Full year (e.g., 2024)
 * @param month - Month (1-12)
 * @param day - Day (1-31)
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @param second - Second (0-59)
 * @returns Object with Julian Day in ephemeris time (ET) and universal time (UT)
 */
export function dateToJulianDay(
  year: number,
  month: number,
  day: number,
  hour: number = 12,
  minute: number = 0,
  second: number = 0
): { jdET: number; jdUT: number } {
  // Validate inputs
  if (month < 1 || month > 12) {
    throw new InvalidBirthDataError(`Invalid month: ${month}. Must be 1-12`);
  }
  if (day < 1 || day > 31) {
    throw new InvalidBirthDataError(`Invalid day: ${day}. Must be 1-31`);
  }
  if (hour < 0 || hour > 23) {
    throw new InvalidBirthDataError(`Invalid hour: ${hour}. Must be 0-23`);
  }
  if (minute < 0 || minute > 59) {
    throw new InvalidBirthDataError(`Invalid minute: ${minute}. Must be 0-59`);
  }
  if (second < 0 || second > 59) {
    throw new InvalidBirthDataError(`Invalid second: ${second}. Must be 0-59`);
  }

  const result = utc_to_jd(year, month, day, hour, minute, second, constants.SE_GREG_CAL);

  if (result.flag !== constants.OK) {
    throw new InvalidBirthDataError(
      `Failed to convert date to Julian Day: ${result.error}`,
      { year, month, day, hour, minute, second }
    );
  }

  const [jdET, jdUT] = result.data;
  return { jdET, jdUT };
}

/**
 * Convert Julian Day (UT) back to UTC date components
 *
 * @param jdUT - Julian Day in Universal Time
 * @returns Date components
 */
export function julianDayToDate(jdUT: number): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const result = jdut1_to_utc(jdUT, constants.SE_GREG_CAL);
  return {
    year: result.year,
    month: result.month,
    day: result.day,
    hour: result.hour,
    minute: result.minute,
    second: Math.round(result.second)
  };
}

/**
 * Parse an ISO date string and time string to Julian Day
 *
 * @param dateStr - ISO date string (YYYY-MM-DD)
 * @param timeStr - Time string (HH:MM:SS or HH:MM) or null for noon
 * @returns Julian Day values
 */
export function parseDateTimeToJulianDay(
  dateStr: string,
  timeStr: string | null
): { jdET: number; jdUT: number } {
  // Parse date
  const dateParts = dateStr.split('-');
  if (dateParts.length !== 3) {
    throw new InvalidBirthDataError(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
  }

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new InvalidBirthDataError(`Invalid date components in: ${dateStr}`);
  }

  // Parse time (default to noon if unknown)
  let hour = 12;
  let minute = 0;
  let second = 0;

  if (timeStr) {
    const timeParts = timeStr.split(':');
    if (timeParts.length < 2) {
      throw new InvalidBirthDataError(`Invalid time format: ${timeStr}. Expected HH:MM or HH:MM:SS`);
    }

    hour = parseInt(timeParts[0], 10);
    minute = parseInt(timeParts[1], 10);
    second = timeParts.length > 2 ? parseInt(timeParts[2], 10) : 0;

    if (isNaN(hour) || isNaN(minute) || isNaN(second)) {
      throw new InvalidBirthDataError(`Invalid time components in: ${timeStr}`);
    }
  }

  return dateToJulianDay(year, month, day, hour, minute, second);
}

// ============================================================================
// Delta T Calculation
// ============================================================================

/**
 * Get Delta T (TT - UT) for a given Julian Day
 *
 * Delta T is the difference between Terrestrial Time (TT, formerly Ephemeris Time)
 * and Universal Time (UT). It's caused by the irregular rotation of the Earth.
 *
 * @param jdUT - Julian Day in Universal Time
 * @returns Delta T in days
 */
export function getDeltaT(jdUT: number): number {
  return deltat(jdUT);
}

/**
 * Get Delta T in seconds for a given Julian Day
 *
 * @param jdUT - Julian Day in Universal Time
 * @returns Delta T in seconds
 */
export function getDeltaTSeconds(jdUT: number): number {
  return deltat(jdUT) * 86400; // Convert days to seconds
}

// ============================================================================
// Local Mean Time (LMT)
// ============================================================================

/**
 * Calculate Local Mean Time adjustment
 *
 * LMT = Standard_Time + (Local_Longitude - Standard_Meridian) / 15 hours
 *
 * @param longitude - Geographic longitude in degrees (-180 to 180)
 * @returns LMT offset in hours
 */
export function getLMTOffset(longitude: number): number {
  // Local Mean Time is based on the Sun's position
  // Each degree of longitude = 4 minutes of time
  // Each 15 degrees = 1 hour
  return longitude / 15;
}

/**
 * Convert UTC to Local Mean Time
 *
 * @param jdUT - Julian Day in Universal Time
 * @param longitude - Geographic longitude in degrees
 * @returns Julian Day in Local Mean Time
 */
export function utcToLMT(jdUT: number, longitude: number): number {
  const lmtOffset = getLMTOffset(longitude) / 24; // Convert hours to days
  return jdUT + lmtOffset;
}

/**
 * Convert Local Mean Time to UTC
 *
 * @param jdLMT - Julian Day in Local Mean Time
 * @param longitude - Geographic longitude in degrees
 * @returns Julian Day in Universal Time
 */
export function lmtToUTC(jdLMT: number, longitude: number): number {
  const lmtOffset = getLMTOffset(longitude) / 24;
  return jdLMT - lmtOffset;
}

// ============================================================================
// Timezone Utilities
// ============================================================================

/**
 * Get timezone offset in hours for a given timezone at a specific date
 *
 * @param timezone - IANA timezone identifier
 * @param date - JavaScript Date object
 * @returns Timezone offset in hours (positive = east of UTC)
 */
export function getTimezoneOffset(timezone: string, date: Date): number {
  try {
    // Get the offset by comparing UTC and local representations
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const localDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));

    // Difference in hours
    return (localDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  } catch {
    throw new InvalidBirthDataError(`Invalid timezone: ${timezone}`);
  }
}

/**
 * Convert local time to UTC based on timezone
 *
 * @param year - Year
 * @param month - Month (1-12)
 * @param day - Day
 * @param hour - Local hour
 * @param minute - Local minute
 * @param second - Local second
 * @param timezone - IANA timezone identifier
 * @returns UTC components
 */
export function localToUTC(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timezone: string
): { year: number; month: number; day: number; hour: number; minute: number; second: number } {
  // Create a date string in the local timezone
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

  // Parse as local time in the given timezone
  const localDate = new Date(dateStr);
  const offset = getTimezoneOffset(timezone, localDate);

  // Adjust to UTC
  const utcMs = localDate.getTime() - (offset * 60 * 60 * 1000);
  const utcDate = new Date(utcMs);

  return {
    year: utcDate.getUTCFullYear(),
    month: utcDate.getUTCMonth() + 1,
    day: utcDate.getUTCDate(),
    hour: utcDate.getUTCHours(),
    minute: utcDate.getUTCMinutes(),
    second: utcDate.getUTCSeconds()
  };
}

// ============================================================================
// Sidereal Time
// ============================================================================

/**
 * Calculate Greenwich Mean Sidereal Time (GMST) for a Julian Day
 *
 * @param jdUT - Julian Day in Universal Time
 * @returns GMST in degrees (0-360)
 */
export function getGMST(jdUT: number): number {
  // Julian centuries from J2000.0
  const T = (jdUT - 2451545.0) / 36525.0;

  // GMST at 0h UT in seconds
  let gmst = 24110.54841 +
             (8640184.812866 * T) +
             (0.093104 * T * T) -
             (0.0000062 * T * T * T);

  // Add UT1 component
  const ut1 = (jdUT - Math.floor(jdUT) - 0.5) * 24;
  gmst += ut1 * 3600 * 1.00273790935;

  // Convert to degrees and normalize to 0-360
  gmst = (gmst / 240) % 360;
  if (gmst < 0) gmst += 360;

  return gmst;
}

/**
 * Calculate Local Sidereal Time (LST) for a location
 *
 * @param jdUT - Julian Day in Universal Time
 * @param longitude - Geographic longitude in degrees
 * @returns LST in degrees (0-360)
 */
export function getLST(jdUT: number, longitude: number): number {
  let lst = getGMST(jdUT) + longitude;
  lst = lst % 360;
  if (lst < 0) lst += 360;
  return lst;
}
