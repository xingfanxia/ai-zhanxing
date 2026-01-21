'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReferralCapture } from '@/hooks/useReferralCapture';
import { useAuth } from '@/components/auth/AuthProvider';
import { ReferralBanner } from './ReferralBanner';
import { ReferralModal } from './ReferralModal';
import { ReferralAnnouncementBanner } from './ReferralAnnouncementBanner';
import { ReferralWelcomeBanner } from './ReferralWelcomeBanner';
import { AuthModal } from '@/components/auth/AuthModal';

interface ReferralProviderProps {
  children: React.ReactNode;
  appName?: string;
  sourceApp?: string;
}

function ReferralCapture({ sourceApp }: { sourceApp: string }) {
  useReferralCapture(sourceApp);
  return null;
}

// Component to detect referral code and auto-open signup modal
function ReferralAutoSignup({ onOpenSignup }: { onOpenSignup: () => void }) {
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const refCode = searchParams.get('ref');
    // Auto-open signup modal if referral code present and user not logged in
    if (refCode && !user) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        onOpenSignup();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, user, isLoading, onOpenSignup]);

  return null;
}

export function ReferralProvider({
  children,
  appName = '占星猫',
  sourceApp = 'zhanxing',
}: ReferralProviderProps) {
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenSignup = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <>
      {/* Capture referral code from URL */}
      <Suspense fallback={null}>
        <ReferralCapture sourceApp={sourceApp} />
      </Suspense>

      {/* Auto-open signup modal for referral visitors */}
      <Suspense fallback={null}>
        <ReferralAutoSignup onOpenSignup={handleOpenSignup} />
      </Suspense>

      {/* Referral welcome banner for non-logged-in users arriving via referral link */}
      <ReferralWelcomeBanner onOpenSignup={handleOpenSignup} />

      {/* Referral announcement banner (one-time announcement for logged-in users) */}
      <ReferralAnnouncementBanner onOpenReferralModal={() => setIsReferralModalOpen(true)} />

      {/* Referral banner CTA (for logged-in users) */}
      <ReferralBanner onOpenReferralModal={() => setIsReferralModalOpen(true)} />

      {/* Main content */}
      {children}

      {/* Referral modal (controlled by banner) */}
      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        appName={appName}
      />

      {/* Auth modal for referral signup (opens in signup mode) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="signup"
      />
    </>
  );
}
