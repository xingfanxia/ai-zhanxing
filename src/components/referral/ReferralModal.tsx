'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Gift, Users, Coins, Share2, Loader2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthProvider';

interface ReferralStats {
  code: string;
  successfulReferrals: number;
  maxReferrals: number;
  pendingCount: number;
  completedCount: number;
  totalBonus: number;
  hasBeenReferred: boolean;
  referrals: Array<{
    id: string;
    status: 'pending' | 'completed' | 'rejected';
    sourceApp: string | null;
    createdAt: string;
    completedAt: string | null;
    bonus: number;
  }>;
}

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
  appUrl?: string;
}

export function ReferralModal({
  isOpen,
  onClose,
  appName = '占星猫',
  appUrl = typeof window !== 'undefined' ? window.location.origin : '',
}: ReferralModalProps) {
  const { user, refreshCredits } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual referral code entry state
  const [manualCode, setManualCode] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/referral/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('获取推荐信息失败');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user) {
      fetchStats();
      // Reset manual entry state when modal opens
      setManualCode('');
      setLinkError(null);
      setLinkSuccess(null);
    }
  }, [isOpen, user, fetchStats]);

  const referralLink = stats?.code ? `${appUrl}/?ref=${stats.code}` : '';

  const handleCopy = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!referralLink || !stats?.code) return;

    const shareText = `使用我的推荐码 ${stats.code} 注册${appName}，我们都能获得20积分奖励！`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${appName} - 推荐好友`,
          text: shareText,
          url: referralLink,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      handleCopy();
    }
  };

  const handleLinkReferralCode = async () => {
    if (!manualCode.trim()) {
      setLinkError('请输入推荐码');
      return;
    }

    setIsLinking(true);
    setLinkError(null);
    setLinkSuccess(null);

    try {
      const response = await fetch('/api/referral/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: manualCode.trim().toUpperCase(),
          sourceApp: 'zhanxing',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setLinkSuccess('推荐码绑定成功！');
        setManualCode('');
        // Refresh stats to update hasBeenReferred
        await fetchStats();
        // Refresh credits in case bonus was awarded
        refreshCredits();
      } else {
        setLinkError(data.message || '绑定推荐码失败');
      }
    } catch {
      setLinkError('网络错误，请稍后重试');
    } finally {
      setIsLinking(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const progressPercent = stats ? (stats.successfulReferrals / stats.maxReferrals) * 100 : 0;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative w-full max-w-md bg-gradient-to-b from-card to-card/95 rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-background/50 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">推荐好友</h2>
                <p className="text-sm text-muted-foreground">邀请好友注册+5，使用解锁+15积分</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {!user ? (
              <div className="text-center py-8 text-muted-foreground">请先登录以获取推荐码</div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">{error}</div>
            ) : stats ? (
              <>
                {/* Manual Referral Code Entry - only show if user hasn't been referred */}
                {!stats.hasBeenReferred && (
                  <div className="space-y-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        有推荐码？在此输入
                      </span>
                    </div>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                      绑定后双方各得+5积分，使用付费功能后再得+15积分（仅注册7天内有效）
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="输入推荐码"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                        className="flex-1 bg-background"
                        maxLength={20}
                        disabled={isLinking}
                      />
                      <Button
                        onClick={handleLinkReferralCode}
                        disabled={isLinking || !manualCode.trim()}
                        size="sm"
                      >
                        {isLinking ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          '使用'
                        )}
                      </Button>
                    </div>
                    {linkError && (
                      <p className="text-xs text-destructive">{linkError}</p>
                    )}
                    {linkSuccess && (
                      <p className="text-xs text-green-600 dark:text-green-400">{linkSuccess}</p>
                    )}
                  </div>
                )}

                {/* Referral Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">您的推荐码</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 bg-muted rounded-lg font-mono text-lg font-bold tracking-wider text-center">
                      {stats.code}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopy}
                      className="h-12 w-12"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Referral Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">推荐链接</label>
                  <div className="px-3 py-2 bg-muted rounded-lg text-sm break-all text-muted-foreground">
                    {referralLink}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCopy} variant="outline" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      复制链接
                    </Button>
                    <Button onClick={handleShare} className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      分享
                    </Button>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">推荐进度</span>
                    <span className="font-medium">
                      {stats.successfulReferrals} / {stats.maxReferrals}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  {stats.successfulReferrals >= stats.maxReferrals && (
                    <p className="text-xs text-amber-500">已达到推荐上限</p>
                  )}
                </div>

                {/* Stats Grid */}
                {(() => {
                  const totalRegistered = stats.pendingCount + stats.completedCount;
                  const signupBonus = totalRegistered * 5;
                  const actionBonus = stats.completedCount * 15;
                  const totalEarned = signupBonus + actionBonus;

                  return (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <div className="text-lg font-bold">{totalRegistered}</div>
                        <div className="text-xs text-muted-foreground">已注册</div>
                        <div className="text-[10px] text-green-500">+5/人</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Loader2 className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                        <div className="text-lg font-bold">{stats.completedCount}</div>
                        <div className="text-xs text-muted-foreground">已付费</div>
                        <div className="text-[10px] text-green-500">+15/人</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Coins className="w-5 h-5 mx-auto mb-1 text-green-500" />
                        <div className="text-lg font-bold">{totalEarned}</div>
                        <div className="text-xs text-muted-foreground">获得积分</div>
                      </div>
                    </div>
                  );
                })()}

                {/* How it works */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-3">推荐规则</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">1.</span>
                      <span>分享您的推荐码或链接给好友</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">2.</span>
                      <span>好友通过链接注册账号</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">3.</span>
                      <span>好友注册成功 <b className="text-primary">+5积分</b>，使用任意解锁功能后再得 <b className="text-primary">+15积分</b></span>
                    </li>
                  </ul>
                </div>
              </>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
