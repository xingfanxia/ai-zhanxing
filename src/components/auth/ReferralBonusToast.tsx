'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Users, Sparkles } from 'lucide-react';
import { onReferralBonus } from './AuthProvider';

type BonusType = 'signup' | 'unlock';

interface BonusData {
  type: BonusType;
  amount: number;
  credits: number;
}

export function ReferralBonusToast() {
  const [show, setShow] = useState(false);
  const [bonusData, setBonusData] = useState<BonusData | null>(null);

  useEffect(() => {
    const unsubscribe = onReferralBonus((data: BonusData) => {
      setBonusData(data);
      setShow(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShow(false), 5000);
    });

    return unsubscribe;
  }, []);

  if (!bonusData) return null;

  const isSignup = bonusData.type === 'signup';
  const title = isSignup ? '欢迎加入!' : '推荐奖励!';
  const description = isSignup
    ? `好友推荐注册成功 · +${bonusData.amount} 额度`
    : `首次使用付费功能 · +${bonusData.amount} 额度`;
  const gradientClass = isSignup
    ? 'from-emerald-500 to-green-600'
    : 'from-purple-500 to-indigo-600';
  const shadowClass = isSignup
    ? 'shadow-emerald-500/30'
    : 'shadow-purple-500/30';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto"
        >
          <div className={`relative flex items-center gap-3 px-5 py-4 bg-gradient-to-r ${gradientClass} rounded-2xl shadow-2xl ${shadowClass}`}>
            {/* Close button */}
            <button
              onClick={() => setShow(false)}
              className="absolute -top-2 -right-2 p-1 bg-white dark:bg-zinc-800 rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <X className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {/* Icon with animation */}
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                {isSignup ? (
                  <Users className="w-6 h-6 text-white" />
                ) : (
                  <Gift className="w-6 h-6 text-white" />
                )}
              </div>
            </motion.div>

            {/* Text */}
            <div className="text-white">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="font-bold text-lg"
              >
                {title}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-white/90"
              >
                {description}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-white/70 mt-1"
              >
                当前 {bonusData.credits} 额度
              </motion.p>
            </div>

            {/* Sparkle effects */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute -top-1 -right-1 text-2xl"
            >
              ✨
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute -bottom-1 -left-1"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
