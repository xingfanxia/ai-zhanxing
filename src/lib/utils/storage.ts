'use client';

/**
 * Local/Session Storage utilities for AI Zhanxing app
 */

// Storage keys for sessionStorage
export const STORAGE_KEYS = {
  // Reading history and results
  CURRENT_READING: 'current_reading',
  READING_HISTORY: 'reading_history',

  // Form data
  FORM_DATA: 'form_data',

  // User preferences
  PREFERRED_PROVIDER: 'preferred_provider',
  THEME: 'theme',

  // Session state
  ACTIVE_TAB: 'active_tab',
  LAST_READING_TYPE: 'last_reading_type',
} as const;

/**
 * Save data to sessionStorage with JSON serialization
 */
export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save failed:', e);
  }
}

/**
 * Load data from sessionStorage with JSON parsing
 */
export function loadFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Storage load failed:', e);
    return null;
  }
}

/**
 * Remove a specific key from sessionStorage
 */
export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.error('Storage remove failed:', e);
  }
}

/**
 * Clear all app-related data from sessionStorage
 */
export function clearAllStorage(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach(key => {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.error('Storage clear failed:', e);
    }
  });
}

/**
 * Save data to localStorage (persistent across sessions)
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage save failed:', e);
  }
}

/**
 * Load data from localStorage
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('LocalStorage load failed:', e);
    return null;
  }
}

/**
 * Typed storage helper for the Zhanxing app
 */
export const ZhanxingStorage = {
  // Reading management
  saveReading: <T>(reading: T) => saveToStorage(STORAGE_KEYS.CURRENT_READING, reading),
  loadReading: <T>() => loadFromStorage<T>(STORAGE_KEYS.CURRENT_READING),
  clearReading: () => removeFromStorage(STORAGE_KEYS.CURRENT_READING),

  // Form data
  saveFormData: <T>(data: T) => saveToStorage(STORAGE_KEYS.FORM_DATA, data),
  loadFormData: <T>() => loadFromStorage<T>(STORAGE_KEYS.FORM_DATA),

  // Active tab
  saveActiveTab: (tab: string) => saveToStorage(STORAGE_KEYS.ACTIVE_TAB, tab),
  loadActiveTab: () => loadFromStorage<string>(STORAGE_KEYS.ACTIVE_TAB),

  // Reading type
  saveLastReadingType: (type: string) => saveToStorage(STORAGE_KEYS.LAST_READING_TYPE, type),
  loadLastReadingType: () => loadFromStorage<string>(STORAGE_KEYS.LAST_READING_TYPE),

  // Theme (persisted in localStorage)
  saveTheme: (theme: 'light' | 'dark' | 'system') => saveToLocalStorage(STORAGE_KEYS.THEME, theme),
  loadTheme: () => loadFromLocalStorage<'light' | 'dark' | 'system'>(STORAGE_KEYS.THEME),

  // Clear all
  clearAll: clearAllStorage,
};

export default ZhanxingStorage;
