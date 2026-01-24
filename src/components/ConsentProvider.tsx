'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useConsent } from '@/hooks/useConsent';
import { ConsentModal } from '@/components/ConsentModal';

interface ConsentProviderProps {
  children: ReactNode;
}

/**
 * Wraps children with consent modal logic.
 * Shows a blocking modal if user hasn't accepted TOS/Privacy Policy.
 */
export function ConsentProvider({ children }: ConsentProviderProps) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { hasConsented, isLoading: isConsentLoading, acceptConsent } = useConsent({
    user,
    isAuthLoading,
  });

  // Don't show modal while loading
  const showModal = !isConsentLoading && !hasConsented;

  return (
    <>
      {children}
      <ConsentModal isOpen={showModal} onAccept={acceptConsent} />
    </>
  );
}

export default ConsentProvider;
