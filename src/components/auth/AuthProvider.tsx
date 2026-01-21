'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { usePostHog } from '@posthog/react';
import type { User, Session } from '@supabase/supabase-js';
import type { CreditsState, SaveLimitState } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  credits: CreditsState;
  isCreditsLoading: boolean;
  saveLimit: SaveLimitState;
  isSaveLimitLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, referralCode?: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (referralCode?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshCredits: () => Promise<void>;
  refreshSaveLimit: () => Promise<void>;
}

const defaultCredits: CreditsState = { credits: 0, checkedInToday: false };
const defaultSaveLimit: SaveLimitState = { used: 0, max: 5 };

// Check-in bonus event for toast notifications
type CheckInCallback = (credits: number) => void;
let checkInCallbacks: CheckInCallback[] = [];

export function onCheckInBonus(callback: CheckInCallback) {
  checkInCallbacks.push(callback);
  return () => {
    checkInCallbacks = checkInCallbacks.filter(cb => cb !== callback);
  };
}

function notifyCheckInBonus(credits: number) {
  checkInCallbacks.forEach(cb => cb(credits));
}

// Referral bonus event for toast notifications
type ReferralBonusType = 'signup' | 'unlock';
interface ReferralBonusData {
  type: ReferralBonusType;
  amount: number;
  credits: number;
}
type ReferralBonusCallback = (data: ReferralBonusData) => void;
let referralBonusCallbacks: ReferralBonusCallback[] = [];

export function onReferralBonus(callback: ReferralBonusCallback) {
  referralBonusCallbacks.push(callback);
  return () => {
    referralBonusCallbacks = referralBonusCallbacks.filter(cb => cb !== callback);
  };
}

export function notifyReferralBonus(type: ReferralBonusType, amount: number, credits: number) {
  referralBonusCallbacks.forEach(cb => cb({ type, amount, credits }));
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState<CreditsState>(defaultCredits);
  const [isCreditsLoading, setIsCreditsLoading] = useState(false);
  const [saveLimit, setSaveLimit] = useState<SaveLimitState>(defaultSaveLimit);
  const [isSaveLimitLoading, setIsSaveLimitLoading] = useState(false);

  const supabase = createClient();
  const posthog = usePostHog();

  // Fetch credits from API
  const refreshCredits = useCallback(async () => {
    if (!user) {
      setCredits(defaultCredits);
      return;
    }

    setIsCreditsLoading(true);
    try {
      const response = await fetch('/api/credits');
      if (response.ok) {
        const data = await response.json();
        setCredits({
          credits: data.credits,
          checkedInToday: data.checkedInToday,
        });
        // Trigger toast if bonus was just awarded
        if (data.bonusAwarded) {
          notifyCheckInBonus(data.credits);
        }
        // Check for referral signup bonus toast (only show once)
        if (data.wasReferred && typeof window !== 'undefined') {
          const shownKey = `referral_signup_bonus_shown_${user?.id}`;
          if (!localStorage.getItem(shownKey)) {
            localStorage.setItem(shownKey, 'true');
            // Small delay to let the page render first
            setTimeout(() => {
              notifyReferralBonus('signup', 5, data.credits);
            }, 500);
          }
        }
      } else {
        // User might be new, use defaults
        setCredits({ credits: 10, checkedInToday: false });
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
      setCredits(defaultCredits);
    } finally {
      setIsCreditsLoading(false);
    }
  }, [user]);

  // Fetch save limit from API
  const refreshSaveLimit = useCallback(async () => {
    if (!user) {
      setSaveLimit(defaultSaveLimit);
      return;
    }

    setIsSaveLimitLoading(true);
    try {
      const response = await fetch('/api/readings?limit=1');
      if (response.ok) {
        const data = await response.json();
        if (data.saveLimit) {
          setSaveLimit({
            used: data.saveLimit.used,
            max: data.saveLimit.max,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch save limit:', error);
    } finally {
      setIsSaveLimitLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Identify user with PostHog when user changes
  useEffect(() => {
    if (user?.email && posthog) {
      posthog.identify(user.email, {
        email: user.email,
        user_id: user.id,
        created_at: user.created_at,
      });
    } else if (!user && posthog) {
      posthog.reset();
    }
  }, [user, posthog]);

  // Fetch credits and save limit when user changes
  useEffect(() => {
    if (user) {
      refreshCredits();
      refreshSaveLimit();
    } else {
      setCredits(defaultCredits);
      setSaveLimit(defaultSaveLimit);
    }
  }, [user, refreshCredits, refreshSaveLimit]);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUpWithEmail = async (email: string, password: string, referralCode?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Redirect to homepage after email confirmation (no callback needed)
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          referral_code: referralCode || null,
          source_app: 'zhanxing',
        },
      },
    });
    return { error: error as Error | null };
  };

  const signInWithGoogle = async (referralCode?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: referralCode ? {
          referral_code: referralCode,
          source_app: 'zhanxing',
        } : undefined,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCredits(defaultCredits);
    setSaveLimit(defaultSaveLimit);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        credits,
        isCreditsLoading,
        saveLimit,
        isSaveLimitLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        refreshCredits,
        refreshSaveLimit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
