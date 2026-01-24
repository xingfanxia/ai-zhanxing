/**
 * PII-Scrubbing Logger Utility
 *
 * Provides structured logging with automatic PII masking for:
 * - Email addresses
 * - UUIDs
 * - Phone numbers
 *
 * Usage:
 *   import { log } from '@/lib/logger';
 *   log.info('User action', { userId: 'abc123-def456-...' });
 *   log.error('Failed operation', error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';

// --- PII Scrubbing Utilities ---

/**
 * Masks an email address: user@email.com -> u***@e***.com
 */
export function maskEmail(email: string): string {
  const emailRegex = /^([^@]+)@([^.]+)\.(.+)$/;
  const match = email.match(emailRegex);

  if (!match) return email;

  const [, localPart, domain, tld] = match;
  const maskedLocal = localPart.length > 1
    ? localPart[0] + '***'
    : localPart + '***';
  const maskedDomain = domain.length > 1
    ? domain[0] + '***'
    : domain + '***';

  return `${maskedLocal}@${maskedDomain}.${tld}`;
}

/**
 * Masks a UUID: abc123-def456-ghi789-jkl012-mno345 -> abc***...
 */
export function maskUuid(uuid: string): string {
  // Standard UUID format: 8-4-4-4-12 hex chars
  const uuidRegex = /^([a-f0-9]{3})[a-f0-9]{5}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  const match = uuid.match(uuidRegex);

  if (match) {
    return `${match[1]}***...`;
  }

  // Handle shorter/non-standard UUIDs - just mask after first 3 chars
  if (uuid.length > 6 && /^[a-f0-9-]+$/i.test(uuid)) {
    return `${uuid.slice(0, 3)}***...`;
  }

  return uuid;
}

/**
 * Masks phone numbers in various formats
 * Examples:
 *   +1-555-123-4567 -> +1-555-***-****
 *   (555) 123-4567 -> (555) ***-****
 *   5551234567 -> 555***4567
 */
export function maskPhone(phone: string): string {
  // International format: +X-XXX-XXX-XXXX
  const intlRegex = /^(\+\d{1,3}[-.\s]?\d{2,3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
  let match = phone.match(intlRegex);
  if (match) {
    return `${match[1]}-***-****`;
  }

  // US format with area code: (XXX) XXX-XXXX
  const usParenRegex = /^(\(\d{3}\))\s?\d{3}[-.\s]?\d{4}$/;
  match = phone.match(usParenRegex);
  if (match) {
    return `${match[1]} ***-****`;
  }

  // Simple 10-digit: XXXXXXXXXX
  const simpleRegex = /^(\d{3})\d{3}(\d{4})$/;
  match = phone.match(simpleRegex);
  if (match) {
    return `${match[1]}***${match[2].slice(-4)}`;
  }

  // Generic: mask middle portion of any phone-like string
  const genericRegex = /^(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  if (genericRegex.test(phone)) {
    // Keep first 3 and last 2 digits visible
    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 10) {
      return `${digits.slice(0, 3)}***${digits.slice(-2)}`;
    }
  }

  return phone;
}

/**
 * Scrubs all PII from a string message
 * Detects and masks emails, UUIDs, and phone numbers
 */
export function scrubPii(message: string): string {
  let scrubbed = message;

  // Mask emails: capture email patterns and replace
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  scrubbed = scrubbed.replace(emailPattern, (match) => maskEmail(match));

  // Mask UUIDs: standard UUID format
  const uuidPattern = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi;
  scrubbed = scrubbed.replace(uuidPattern, (match) => maskUuid(match));

  // Mask phone numbers: various formats
  // International: +1-555-123-4567, +44 20 7123 4567
  const phonePatterns = [
    /\+\d{1,3}[-.\s]?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g,  // International
    /\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/g,                         // US with parens
    /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/g,                       // US standard
  ];

  for (const pattern of phonePatterns) {
    scrubbed = scrubbed.replace(pattern, (match) => maskPhone(match));
  }

  return scrubbed;
}

/**
 * Recursively scrubs PII from an object/array
 */
function scrubPiiFromData(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return scrubPii(data);
  }

  if (Array.isArray(data)) {
    return data.map(scrubPiiFromData);
  }

  if (typeof data === 'object') {
    const scrubbed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      // Check if key suggests PII and mask more aggressively
      const piiKeys = ['email', 'phone', 'userId', 'user_id', 'uuid', 'id', 'token'];
      const isPiiKey = piiKeys.some(piiKey =>
        key.toLowerCase().includes(piiKey.toLowerCase())
      );

      if (isPiiKey && typeof value === 'string') {
        // For PII-related keys, always scrub the value
        scrubbed[key] = scrubPii(value);
      } else {
        scrubbed[key] = scrubPiiFromData(value);
      }
    }
    return scrubbed;
  }

  return data;
}

// --- Logging Functions ---

/**
 * Formats a log entry
 */
function formatLogEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
  const scrubbedMessage = scrubPii(message);
  const scrubbedData = data !== undefined ? scrubPiiFromData(data) : undefined;

  return {
    timestamp: new Date().toISOString(),
    level,
    message: scrubbedMessage,
    ...(scrubbedData !== undefined && { data: scrubbedData }),
  };
}

/**
 * Outputs log entry to console
 */
function outputLog(entry: LogEntry): void {
  const { timestamp, level, message, data } = entry;

  if (isProduction) {
    // JSON format for production (better for log aggregation)
    console.log(JSON.stringify(entry));
  } else {
    // Human-readable format for development
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        if (data !== undefined) {
          console.debug(prefix, message, data);
        } else {
          console.debug(prefix, message);
        }
        break;
      case 'info':
        if (data !== undefined) {
          console.info(prefix, message, data);
        } else {
          console.info(prefix, message);
        }
        break;
      case 'warn':
        if (data !== undefined) {
          console.warn(prefix, message, data);
        } else {
          console.warn(prefix, message);
        }
        break;
      case 'error':
        if (data !== undefined) {
          console.error(prefix, message, data);
        } else {
          console.error(prefix, message);
        }
        break;
    }
  }
}

// --- Exported Logger Interface ---

export const log = {
  /**
   * Debug level logging (only in development)
   */
  debug(message: string, data?: unknown): void {
    if (!isProduction) {
      const entry = formatLogEntry('debug', message, data);
      outputLog(entry);
    }
  },

  /**
   * Info level logging
   */
  info(message: string, data?: unknown): void {
    const entry = formatLogEntry('info', message, data);
    outputLog(entry);
  },

  /**
   * Warning level logging
   */
  warn(message: string, data?: unknown): void {
    const entry = formatLogEntry('warn', message, data);
    outputLog(entry);
  },

  /**
   * Error level logging
   */
  error(message: string, errorOrData?: unknown): void {
    // Handle Error objects specially
    let data: unknown;
    if (errorOrData instanceof Error) {
      data = {
        name: errorOrData.name,
        message: scrubPii(errorOrData.message),
        stack: isProduction ? undefined : errorOrData.stack,
      };
    } else {
      data = errorOrData;
    }

    const entry = formatLogEntry('error', message, data);
    outputLog(entry);
  },
};

// Default export
export default log;
