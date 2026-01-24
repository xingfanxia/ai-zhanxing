/**
 * Field-level encryption for sensitive data
 *
 * Uses AES-256-GCM for authenticated encryption.
 * - Key: 32-byte key from ENCRYPTION_KEY env var (base64 encoded)
 * - IV: Random 12-byte nonce generated per encryption
 * - Auth Tag: 16-byte authentication tag for integrity verification
 *
 * Format: base64(IV || ciphertext || authTag)
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits - recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Get the encryption key from environment variable.
 * Key must be 32 bytes (256 bits), base64 encoded.
 */
function getEncryptionKey(): Buffer {
  const keyBase64 = process.env.ENCRYPTION_KEY;

  if (!keyBase64) {
    throw new Error(
      'ENCRYPTION_KEY environment variable is not set. ' +
      'Generate one with: openssl rand -base64 32'
    );
  }

  const key = Buffer.from(keyBase64, 'base64');

  if (key.length !== 32) {
    throw new Error(
      `ENCRYPTION_KEY must be 32 bytes (256 bits) when decoded. ` +
      `Got ${key.length} bytes. Generate with: openssl rand -base64 32`
    );
  }

  return key;
}

/**
 * Check if encryption is configured and available.
 * Returns false if ENCRYPTION_KEY is not set (allows graceful degradation).
 */
export function isEncryptionEnabled(): boolean {
  return !!process.env.ENCRYPTION_KEY;
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 *
 * @param plaintext - The string to encrypt
 * @returns Base64-encoded ciphertext (IV || ciphertext || authTag)
 * @throws Error if encryption key is not configured or encryption fails
 */
export function encryptField(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Combine: IV (12 bytes) + ciphertext + authTag (16 bytes)
  const combined = Buffer.concat([iv, encrypted, authTag]);

  return combined.toString('base64');
}

/**
 * Decrypt a ciphertext string using AES-256-GCM.
 *
 * @param ciphertext - Base64-encoded ciphertext (IV || ciphertext || authTag)
 * @returns Decrypted plaintext string
 * @throws Error if decryption fails (wrong key, tampered data, etc.)
 */
export function decryptField(ciphertext: string): string {
  const key = getEncryptionKey();
  const combined = Buffer.from(ciphertext, 'base64');

  if (combined.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error('Invalid ciphertext: too short');
  }

  // Extract components
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(combined.length - AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH, combined.length - AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * Encrypt a JSON object.
 *
 * @param obj - The object to encrypt
 * @returns Base64-encoded encrypted JSON string
 */
export function encryptJson(obj: object): string {
  const json = JSON.stringify(obj);
  return encryptField(json);
}

/**
 * Decrypt an encrypted JSON object.
 *
 * @param ciphertext - Base64-encoded encrypted JSON
 * @returns The decrypted object
 */
export function decryptJson<T = object>(ciphertext: string): T {
  const json = decryptField(ciphertext);
  return JSON.parse(json) as T;
}

/**
 * Safely encrypt a field, returning the original value if encryption is disabled.
 * Useful for gradual rollout or environments where encryption isn't configured.
 *
 * @param plaintext - The string to encrypt
 * @returns Encrypted string if encryption is enabled, original plaintext otherwise
 */
export function safeEncryptField(plaintext: string): string {
  if (!isEncryptionEnabled()) {
    return plaintext;
  }
  return encryptField(plaintext);
}

/**
 * Safely decrypt a field, detecting whether it's encrypted.
 * If encryption is disabled or the field doesn't look encrypted, returns as-is.
 *
 * @param possibleCiphertext - The string that might be encrypted
 * @returns Decrypted string if it was encrypted, original string otherwise
 */
export function safeDecryptField(possibleCiphertext: string): string {
  if (!isEncryptionEnabled()) {
    return possibleCiphertext;
  }

  // Check if this looks like encrypted data (base64 with minimum length)
  // IV (12) + at least 1 byte + authTag (16) = 29 bytes minimum, ~40 chars base64
  if (possibleCiphertext.length < 40) {
    return possibleCiphertext;
  }

  // Try to detect if it's base64 encoded (encrypted)
  // Valid base64 only contains A-Z, a-z, 0-9, +, /, and =
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  if (!base64Regex.test(possibleCiphertext)) {
    return possibleCiphertext;
  }

  try {
    return decryptField(possibleCiphertext);
  } catch {
    // If decryption fails, assume it's not encrypted data
    return possibleCiphertext;
  }
}

/**
 * Safely encrypt a JSON object.
 * Returns the original JSON string if encryption is disabled.
 *
 * @param obj - The object to encrypt
 * @returns Encrypted string if encryption is enabled, JSON string otherwise
 */
export function safeEncryptJson(obj: object): string {
  if (!isEncryptionEnabled()) {
    return JSON.stringify(obj);
  }
  return encryptJson(obj);
}

/**
 * Safely decrypt a JSON object.
 * Handles both encrypted and unencrypted JSON.
 *
 * @param possibleCiphertext - The string that might be encrypted JSON
 * @returns The decrypted/parsed object
 */
export function safeDecryptJson<T = object>(possibleCiphertext: string): T {
  if (!isEncryptionEnabled()) {
    return JSON.parse(possibleCiphertext) as T;
  }

  // First, try parsing as plain JSON (for backward compatibility)
  try {
    // If it starts with { or [, it's likely unencrypted JSON
    const trimmed = possibleCiphertext.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return JSON.parse(possibleCiphertext) as T;
    }
  } catch {
    // Not valid JSON, might be encrypted
  }

  // Try decrypting
  try {
    return decryptJson<T>(possibleCiphertext);
  } catch {
    // If decryption fails, try parsing as JSON (backward compatibility)
    return JSON.parse(possibleCiphertext) as T;
  }
}
