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
   */
  useEffect(() => {
    // Wait for auth to settle
    if (isAuthLoading) {
      return;
    }

    const checkConsent = async () => {
      setIsLoading(true);

      // Check localStorage first
      const localConsent = localStorage.getItem(STORAGE_KEY);
      if (localConsent) {
        setHasConsented(true);
        setIsLoading(false);

        // If user is logged in but has local consent, sync to server
        if (user) {
          syncConsentToServer(localConsent);
        }
        return;
      }

      // If logged in, check server
      if (user) {
        try {
          const response = await fetch('/api/user/consent');
          if (response.ok) {
            const data = await response.json();
            if (data.tosAcceptedAt) {
              // User has consented, update local
              localStorage.setItem(STORAGE_KEY, data.tosAcceptedAt);
              setHasConsented(true);
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('[useConsent] Failed to check server consent:', error);
        }
      }

      // No consent found anywhere
      setHasConsented(false);
      setIsLoading(false);
    };

    checkConsent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
