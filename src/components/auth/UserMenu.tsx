'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, History, ChevronDown, Coins, Archive } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { AuthModal } from './AuthModal';
import { Button } from '@/components/ui/button';

interface UserMenuProps {
  onHistoryClick?: () => void;
}

export function UserMenu({ onHistoryClick }: UserMenuProps) {
  const { user, isLoading, signOut, credits, saveLimit } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
    );
  }

  if (!user) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAuthModalOpen(true)}
          className="gap-2"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Button>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  const displayName = user.email?.split('@')[0] || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      {/* Credits Badge */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/50 text-sm">
        <Coins className="w-4 h-4 text-amber-500" />
        <span className="font-medium">{credits.credits}</span>
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-1 p-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
            {avatarLetter}
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-card rounded-lg shadow-lg border border-border z-50 overflow-hidden"
              >
                {/* User info */}
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>

                {/* Credits & Save Limit info */}
                <div className="p-3 border-b border-border bg-secondary/30 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className="text-muted-foreground">Credits</span>
                    <span className="font-medium text-foreground ml-auto">{credits.credits}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Archive className="w-4 h-4 text-blue-500" />
                    <span className="text-muted-foreground">Saved</span>
                    <span className={`font-medium ml-auto ${
                      saveLimit.used >= saveLimit.max ? 'text-destructive' : 'text-foreground'
                    }`}>
                      {saveLimit.used}/{saveLimit.max}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {credits.checkedInToday ? (
                      <span className="text-green-600 dark:text-green-400">Daily bonus claimed</span>
                    ) : (
                      <span>Use a feature for +2 daily bonus</span>
                    )}
                  </div>
                </div>

                <div className="p-1">
                  {onHistoryClick && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onHistoryClick();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md transition-colors"
                    >
                      <History className="w-4 h-4" />
                      History
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await signOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
