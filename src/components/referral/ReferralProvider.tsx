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

// Combined component to handle auto-open modal and welcome banner coordination
// This prevents banner flash by coordinating both behaviors
function ReferralAutoSignupWithBanner({ onOpenSignup }: { onOpenSignup: () => void }) {
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Check if we should auto-open the modal
  const shouldAutoOpen = !isLoading && !!searchParams.get('ref') && !user;

  useEffect(() => {
    if (isLoading) return;

    const refCode = searchParams.get('ref');
    // Auto-open signup modal if referral code present and user not logged in
    if (refCode && !user && !hasAutoOpened) {
      // Reduced delay for faster modal opening
      const timer = setTimeout(() => {
        setHasAutoOpened(true);
        onOpenSignup();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [searchParams, user, isLoading, onOpenSignup, hasAutoOpened]);

  // Pass willAutoOpenModal to banner so it knows to skip showing
  return <ReferralWelcomeBanner onOpenSignup={onOpenSignup} willAutoOpenModal={shouldAutoOpen} />;
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

      {/* Auto-open signup modal for referral visitors + welcome banner (coordinated to prevent flash) */}
      <Suspense fallback={null}>
        <ReferralAutoSignupWithBanner onOpenSignup={handleOpenSignup} />
      </Suspense>

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
