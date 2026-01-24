/**
 * Input Validation Utilities
 *
 * Security-focused validation for API inputs including:
 * - Length limits
 * - XSS prevention
 * - SQL injection pattern detection
 * - Rate limiting helpers
 */

// Constants for validation limits
export const VALIDATION_LIMITS = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_QUESTION_LENGTH: 500,
  MAX_LOCATION_LENGTH: 200,
  MAX_REQUEST_BODY_SIZE: 50 * 1024, // 50KB
} as const;

// Common XSS patterns to strip
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onclick=, onerror=, etc.
  /<iframe\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<link\b[^>]*>/gi,
];

// SQL injection patterns (for logging/alerting, not blocking)
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b.*\b(FROM|INTO|TABLE|SET|WHERE)\b)/gi,
  /(['"])\s*;\s*--/gi, // String termination followed by comment
  /\b(OR|AND)\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/gi, // OR 1=1 style
];

export interface ValidationResult {
  valid: boolean;
  sanitized?: string;
  error?: string;
  warnings?: string[];
}

/**
 * Sanitizes input by removing potentially dangerous patterns
 * @param input - Raw user input
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  let sanitized = input;

  // Remove XSS patterns
  for (const pattern of XSS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Encode HTML entities for safety
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return sanitized.trim();
}

/**
 * Checks for SQL injection patterns (for logging/alerting)
 * @param input - User input to check
 * @returns Array of detected patterns (empty if clean)
 */
export function detectSQLInjection(input: string): string[] {
  const detectedPatterns: string[] = [];

  for (const pattern of SQL_INJECTION_PATTERNS) {
    const matches = input.match(pattern);
    if (matches) {
      detectedPatterns.push(...matches);
    }
  }

  return detectedPatterns;
}

/**
 * Validates a question/query for tarot or astrology readings
 * @param question - User question to validate
 * @returns Validation result with sanitized question or error
 */
export function validateQuestion(question: unknown): ValidationResult {
  const warnings: string[] = [];

  // Type check
  if (typeof question !== 'string') {
    return { valid: false, error: 'Question must be a string' };
  }

  // Empty check - questions are optional, so empty is valid
  if (!question || question.trim().length === 0) {
    return { valid: true, sanitized: '' };
  }

  // Length check
  if (question.length > VALIDATION_LIMITS.MAX_QUESTION_LENGTH) {
    return {
      valid: false,
      error: `Question exceeds maximum length of ${VALIDATION_LIMITS.MAX_QUESTION_LENGTH} characters`
    };
  }

  // SQL injection detection (log warning but don't block)
  const sqlPatterns = detectSQLInjection(question);
  if (sqlPatterns.length > 0) {
    warnings.push(`Potential SQL injection patterns detected: ${sqlPatterns.length}`);
  }

  // Sanitize input
  const sanitized = sanitizeInput(question);

  return {
    valid: true,
    sanitized,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validates a location string for birth chart calculation
 * @param location - Location string to validate
 * @returns Validation result
 */
export function validateLocation(location: unknown): ValidationResult {
  // Type check
  if (typeof location !== 'string') {
    return { valid: false, error: 'Location must be a string' };
  }

  // Empty check
  if (!location || location.trim().length === 0) {
    return { valid: false, error: 'Location cannot be empty' };
  }

  // Length check
  if (location.length > VALIDATION_LIMITS.MAX_LOCATION_LENGTH) {
    return {
      valid: false,
      error: `Location exceeds maximum length of ${VALIDATION_LIMITS.MAX_LOCATION_LENGTH} characters`
    };
  }

  // Sanitize input
  const sanitized = sanitizeInput(location);

  return { valid: true, sanitized };
}

/**
 * Validates coordinates (latitude/longitude)
 * @param lat - Latitude value
 * @param lng - Longitude value
 * @returns Validation result
 */
export function validateCoordinates(lat: unknown, lng: unknown): ValidationResult {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return { valid: false, error: 'Coordinates must be numbers' };
  }

  if (isNaN(lat) || isNaN(lng)) {
    return { valid: false, error: 'Coordinates cannot be NaN' };
  }

  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }

  if (lng < -180 || lng > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }

  return { valid: true };
}

/**
 * Validates a date string (ISO format or common formats)
 * @param date - Date string to validate
 * @returns Validation result
 */
export function validateDateString(date: unknown): ValidationResult {
  if (typeof date !== 'string') {
    return { valid: false, error: 'Date must be a string' };
  }

  if (!date || date.trim().length === 0) {
    return { valid: false, error: 'Date cannot be empty' };
  }

  // Try parsing the date
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }

  // Check for reasonable date range (1800-2100)
  const year = parsed.getFullYear();
  if (year < 1800 || year > 2100) {
    return { valid: false, error: 'Date must be between 1800 and 2100' };
  }

  return { valid: true, sanitized: date.trim() };
}

/**
 * Validates the locale parameter
 * @param locale - Locale string to validate
 * @returns Validation result
 */
export function validateLocale(locale: unknown): ValidationResult {
  const validLocales = ['zh-CN', 'en'];

  if (typeof locale !== 'string') {
    return { valid: false, error: 'Locale must be a string' };
  }

  if (!validLocales.includes(locale)) {
    return { valid: false, error: `Invalid locale. Must be one of: ${validLocales.join(', ')}` };
  }

  return { valid: true };
}

/**
 * Validates a UUID
 * @param uuid - UUID string to validate
 * @returns Validation result
 */
export function validateUUID(uuid: unknown): ValidationResult {
  if (typeof uuid !== 'string') {
    return { valid: false, error: 'UUID must be a string' };
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    return { valid: false, error: 'Invalid UUID format' };
  }

  return { valid: true };
}

/**
 * Creates a standardized error response
 * @param message - Error message
 * @param status - HTTP status code
 * @returns Response object
 */
export function createErrorResponse(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
