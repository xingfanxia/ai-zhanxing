'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';

const WELCOME_BANNER_DISMISSED_KEY = 'xuanxue_referral_welcome_dismissed';

interface ReferralWelcomeBannerProps {
  onOpenSignup: () => void;
}

function ReferralWelcomeBannerInner({ onOpenSignup }: ReferralWelcomeBannerProps) {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Get referral code from URL
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode.trim().toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    // Only show if:
    // 1. There's a referral code in URL
    // 2. User is NOT logged in
    // 3. Banner hasn't been dismissed in this session
    if (isLoading) return;

    const isDismissed = sessionStorage.getItem(WELCOME_BANNER_DISMISSED_KEY);

    if (referralCode && !user && !isDismissed) {
      // Small delay for smoother appearance
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [referralCode, user, isLoading]);

  const handleDismiss = () => {
    sessionStorage.setItem(WELCOME_BANNER_DISMISSED_KEY, 'true');
    setIsVisible(false);
  };

  const handleSignupClick = () => {
    onOpenSignup();
    // Don't dismiss - let user see it if they close the modal
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[9998] bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 text-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Main content */}
            <div className="flex items-center gap-3 flex-1">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                <Gift className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:hidden" />
                  <span className="font-semibold text-sm sm:text-base">
                    您已收到好友邀请！
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/90 mt-0.5">
                  注册后双方各得 <b className="text-yellow-200">20积分</b> 奖励
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleSignupClick}
              className="bg-white text-emerald-700 hover:bg-white/90 font-semibold px-4 py-2 text-sm whitespace-nowrap"
            >
              立即注册
            </Button>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ReferralWelcomeBanner({ onOpenSignup }: ReferralWelcomeBannerProps) {
  return (
    <Suspense fallback={null}>
      <ReferralWelcomeBannerInner onOpenSignup={onOpenSignup} />
    </Suspense>
  );
}
