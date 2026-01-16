"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const sisterApps = [
  { name: "八字排盘", href: "https://bazi.ax0x.ai", current: false },
  { name: "AI解梦", href: "https://jiemeng.ax0x.ai", current: false },
  { name: "占星", href: "#", current: true, comingSoon: true },
  { name: "六壬起卦", href: "https://liuren.ax0x.ai", current: false },
  { name: "人生K线", href: "https://kxian.ax0x.ai", current: false },
  { name: "对话式MBTI测试", href: "https://mbti.ax0x.ai", current: false },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-purple-500/10 bg-slate-950/80 backdrop-blur-sm">
      {/* Subtle star effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-purple-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/panpanmao.png"
              alt="Panpan Mao Logo"
              width={40}
              height={40}
              className="rounded-full ring-1 ring-purple-500/30"
            />
            <span className="text-slate-400 text-sm font-medium">
              盘盘猫 Panpan Mao Entertainment
            </span>
          </div>

          {/* Sister Apps */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {sisterApps.map((app) => (
              <a
                key={app.name}
                href={app.current ? undefined : app.href}
                target={app.current ? undefined : "_blank"}
                rel={app.current ? undefined : "noopener noreferrer"}
                className={`text-sm transition-colors ${
                  app.current
                    ? "text-purple-400 cursor-default flex items-center gap-1"
                    : "text-slate-500 hover:text-purple-300"
                }`}
              >
                {app.current && <Star className="w-3 h-3" />}
                {app.name}
                {app.comingSoon && (
                  <span className="ml-1 text-xs text-slate-600">(Coming Soon)</span>
                )}
              </a>
            ))}
          </div>

          {/* Credit */}
          <div className="text-slate-600 text-xs">
            Made by AX & Claude Code
          </div>
        </div>
      </div>
    </footer>
  );
}