'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

const BANNER_DISMISSED_KEY = 'xuanxue_referral_banner_dismissed';

interface ReferralBannerProps {
  onOpenReferralModal: () => void;
}

export function ReferralBanner({ onOpenReferralModal }: ReferralBannerProps) {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Check if banner was dismissed in the last 7 days
    const dismissedAt = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (dismissedTime > sevenDaysAgo) {
        setIsDismissed(true);
        return;
      }
    }
    setIsDismissed(false);
  }, []);

  useEffect(() => {
    // Only show banner if user is logged in and not dismissed
    if (user && !isDismissed) {
      // Delay showing to avoid flash
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [user, isDismissed]);

  const handleDismiss = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, Date.now().toString());
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleClick = () => {
    onOpenReferralModal();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative bg-gradient-to-r from-primary/90 via-primary to-primary/90 text-primary-foreground"
      >
        <div
          className="flex items-center justify-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-primary-foreground/10 transition-colors"
          onClick={handleClick}
        >
          <Gift className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            邀请好友注册，双方各得 <b>20积分</b>
          </span>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-primary-foreground/20 transition-colors"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
