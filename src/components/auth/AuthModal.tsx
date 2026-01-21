'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader2, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from './AuthProvider';

type AuthMode = 'login' | 'signup' | 'forgot' | 'magic';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

// Helper to get referral code from URL
function getReferralCodeFromUrl(): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get('ref')?.trim().toUpperCase() || '';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, signInWithMagicLink } = useAuth();

  // For SSR safety - only render portal on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill referral code from URL when modal opens in signup mode
  useEffect(() => {
    if (isOpen && mode === 'signup') {
      const urlCode = getReferralCodeFromUrl();
      if (urlCode && !referralCode) {
        setReferralCode(urlCode);
      }
    }
  }, [isOpen, mode, referralCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // Translate common Supabase errors to Chinese
    const translateError = (msg: string) => {
      if (msg.includes('Email not confirmed')) return 'Email not verified. Please check your inbox.';
      if (msg.includes('Invalid login credentials')) return 'Invalid email or password';
      if (msg.includes('already registered')) return 'Email already registered. Please log in.';
      if (msg.includes('Password should be')) return 'Password must be at least 6 characters';
      if (msg.includes('rate limit')) return 'Too many attempts. Please try again later.';
      return msg;
    };

    try {
      if (mode === 'login') {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setError(translateError(error.message));
        } else {
          onClose();
        }
      } else if (mode === 'signup') {
        const { error } = await signUpWithEmail(email, password, referralCode || undefined);
        if (error) {
          setError(translateError(error.message));
        } else {
          setSuccess('Registration successful! Please check your email for verification.');
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          setError(translateError(error));
        } else {
          setSuccess('Password reset link sent! Please check your email.');
        }
      } else if (mode === 'magic') {
        const { error } = await signInWithMagicLink(email);
        if (error) {
          setError(translateError(error));
        } else {
          setSuccess('Magic link sent! Please check your email.');
        }
      }
    } catch {
      setError('Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    // Pass referral code from URL or input field
    const code = referralCode || getReferralCodeFromUrl();
    const { error } = await signInWithGoogle(code || undefined);
    if (error) {
      setError(error.message);
    }
  };

  // Don't render on server or when not open
  if (!mounted || !isOpen) return null;

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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md my-auto bg-card rounded-2xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-border">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-xl font-semibold text-foreground">
              {mode === 'login' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'magic' && 'Magic Link Login'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === 'login' && 'Sign in to save and manage your readings'}
              {mode === 'signup' && 'Create an account to save your readings'}
              {mode === 'forgot' && 'Enter your email to receive a password reset link'}
              {mode === 'magic' && 'Enter your email to receive a magic link'}
            </p>
          </div>

          {/* Signup benefits banner */}
          {mode === 'signup' && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-sm text-purple-700 dark:text-purple-400">
                New users receive <strong>10 free</strong> reading credits
              </p>
              <p className="text-xs text-purple-600/80 dark:text-purple-500/80 mt-1">
                Plus 2 free credits daily
              </p>
            </div>
          )}

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Google Sign In - only for login/signup modes */}
            {(mode === 'login' || mode === 'signup') && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
              </>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password field - only for login/signup modes */}
              {(mode === 'login' || mode === 'signup') && (
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                  {/* Forgot password link - only in login mode */}
                  {mode === 'login' && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setError(null);
                          setSuccess(null);
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Referral code input - only in signup mode */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <div className="relative">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Referral code (optional)"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="pl-10"
                      maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground pl-1">
                    Have a friend&apos;s referral code? Enter it to get bonus credits!
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <User className="w-4 h-4 mr-2" />
                )}
                {mode === 'login' && 'Sign In'}
                {mode === 'signup' && 'Sign Up'}
                {mode === 'forgot' && 'Send Reset Link'}
                {mode === 'magic' && 'Send Magic Link'}
              </Button>

              {/* Magic link option - only in login mode */}
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('magic');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="w-full text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Sign in with magic link instead
                </button>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 text-center space-y-2">
            {(mode === 'login' || mode === 'signup') && (
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError(null);
                  setSuccess(null);
                }}
                className="text-sm text-primary hover:underline"
              >
                {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            )}
            {(mode === 'forgot' || mode === 'magic') && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccess(null);
                }}
                className="text-sm text-primary hover:underline"
              >
                Back to sign in
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Use portal to render at document.body level, escaping any stacking context
  return createPortal(modalContent, document.body);
}
