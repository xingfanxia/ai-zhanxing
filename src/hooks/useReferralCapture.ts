'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const REFERRAL_CODE_KEY = 'xuanxue_pending_referral';
const REFERRAL_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface PendingReferral {
  code: string;
  sourceApp: string;
  capturedAt: number;
}

/**
 * Hook to capture referral codes from URL and store in localStorage
 * Usage: Add to your app's root layout or main page component
 *
 * Example: https://zhanxing.panpanmao.com/?ref=PPM-ABC123
 */
export function useReferralCapture(sourceApp: string = 'zhanxing') {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode && refCode.trim()) {
      const data: PendingReferral = {
        code: refCode.trim().toUpperCase(),
        sourceApp,
        capturedAt: Date.now(),
      };
      localStorage.setItem(REFERRAL_CODE_KEY, JSON.stringify(data));

      // Clean URL without refreshing page (optional UX improvement)
      const url = new URL(window.location.href);
      url.searchParams.delete('ref');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, sourceApp]);
}

/**
 * Get pending referral from localStorage (if not expired)
 */
export function getPendingReferral(): PendingReferral | null {
  try {
    const stored = localStorage.getItem(REFERRAL_CODE_KEY);
    if (!stored) return null;

    const data: PendingReferral = JSON.parse(stored);

    // Check if expired (24 hours)
    if (Date.now() - data.capturedAt > REFERRAL_EXPIRY_MS) {
      localStorage.removeItem(REFERRAL_CODE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Clear pending referral from localStorage
 */
export function clearPendingReferral(): void {
  localStorage.removeItem(REFERRAL_CODE_KEY);
}

/**
 * Link pending referral to current user (call after successful signup)
 * Returns true if referral was successfully linked
 */
export async function linkPendingReferral(): Promise<boolean> {
  const pending = getPendingReferral();
  if (!pending) return false;

  try {
    const response = await fetch('/api/referral/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: pending.code,
        sourceApp: pending.sourceApp,
      }),
    });

    const data = await response.json();

    // Clear regardless of success (don't retry failed links)
    clearPendingReferral();

    return data.success === true;
  } catch (error) {
    console.error('Failed to link referral:', error);
    clearPendingReferral();
    return false;
  }
}
