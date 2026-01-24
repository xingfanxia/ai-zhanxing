'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function ConsentModal({ isOpen, onAccept }: ConsentModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = useCallback(() => {
    if (isChecked) {
      onAccept();
    }
  }, [isChecked, onAccept]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl p-6 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-4">
          使用条款与隐私政策
        </h2>

        {/* Intro text */}
        <p className="text-slate-300 mb-6 text-sm">
          在开始使用前，请阅读并同意我们的服务条款和隐私政策。
        </p>

        {/* Checkbox with links */}
        <label className="flex items-start gap-3 text-left mb-6 cursor-pointer group">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-slate-900 cursor-pointer"
          />
          <span className="text-sm text-slate-200">
            我已阅读并同意{' '}
            <Link
              href="/legal/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline font-medium"
            >
              服务条款
            </Link>
            {' '}和{' '}
            <Link
              href="/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline font-medium"
            >
              隐私政策
            </Link>
          </span>
        </label>

        {/* Accept button */}
        <button
          onClick={handleAccept}
          disabled={!isChecked}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
            isChecked
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl cursor-pointer'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          同意并继续
        </button>
      </div>
    </div>
  );
}

export default ConsentModal;
