'use client';

/**
 * Consent hook for Terms of Service and Privacy Policy
 *
 * - Anonymous users: stored in localStorage
 * - Logged-in users: also synced to Supabase user_profiles.tos_accepted_at
 */

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';

const STORAGE_KEY = 'tos_accepted_at';

export interface UseConsentOptions {
  user: User | null;
  isAuthLoading: boolean;
}

export interface UseConsentReturn {
  hasConsented: boolean;
  isLoading: boolean;
  acceptConsent: () => Promise<void>;
}

/**
 * Hook to manage TOS/Privacy consent state
 */
export function useConsent({ user, isAuthLoading }: UseConsentOptions): UseConsentReturn {
  const [hasConsented, setHasConsented] = useState(true); // Default to true to avoid flash
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check consent status from localStorage and/or server
   *
   * For logged-in users: ALWAYS check server first (enables cross-app consent sharing)
   * For anonymous users: use localStorage only
   */
  useEffect(() => {
    // Wait for auth to settle
    if (isAuthLoading) {
      return;
    }

    const checkConsent = async () => {
      setIsLoading(true);

      // For logged-in users: check server FIRST (enables cross-subdomain consent sharing)
      if (user) {
        try {
          const response = await fetch('/api/user/consent');
          if (response.ok) {
            const data = await response.json();
            if (data.tosAcceptedAt) {
              // User has consented (in any app), update localStorage for faster checks
              localStorage.setItem(STORAGE_KEY, data.tosAcceptedAt);
              setHasConsented(true);
              setIsLoading(false);
              return;
            }
          } else {
            // API returned error - log but don't fall through to showing modal
            console.error('[useConsent] API returned non-ok status:', response.status);
          }
        } catch (error) {
          console.error('[useConsent] Failed to check server consent:', error);
          // On error, check localStorage as fallback (don't show modal unnecessarily)
          const localConsent = localStorage.getItem(STORAGE_KEY);
          if (localConsent) {
            setHasConsented(true);
            setIsLoading(false);
            return;
          }
        }

        // Check localStorage fallback for logged-in users
        // (in case server check failed but they have local consent)
        const localConsent = localStorage.getItem(STORAGE_KEY);
        if (localConsent) {
          setHasConsented(true);
          setIsLoading(false);
          // Try to sync to server in background
          syncConsentToServer(localConsent);
          return;
        }

        // No consent found for logged-in user
        setHasConsented(false);
        setIsLoading(false);
        return;
      }

      // For anonymous users: localStorage only
      const localConsent = localStorage.getItem(STORAGE_KEY);
      if (localConsent) {
        setHasConsented(true);
        setIsLoading(false);
        return;
      }

      // No consent found
      setHasConsented(false);
      setIsLoading(false);
    };

    checkConsent();
  }, [user, isAuthLoading]);

  /**
   * Sync local consent timestamp to server (fire-and-forget)
   */
  const syncConsentToServer = useCallback(async (timestamp: string) => {
    try {
      await fetch('/api/user/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tosAcceptedAt: timestamp }),
      });
    } catch (error) {
      console.error('[useConsent] Failed to sync consent to server:', error);
    }
  }, []);

  /**
   * Accept consent - saves to localStorage and server (if logged in)
   */
  const acceptConsent = useCallback(async () => {
    const timestamp = new Date().toISOString();

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, timestamp);
    setHasConsented(true);

    // Save to server if logged in
    if (user) {
      try {
        await fetch('/api/user/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tosAcceptedAt: timestamp }),
        });
      } catch (error) {
        console.error('[useConsent] Failed to save consent to server:', error);
        // Don't revert - local consent is still valid
      }
    }
  }, [user]);

  return {
    hasConsented,
    isLoading,
    acceptConsent,
  };
}

export default useConsent;
