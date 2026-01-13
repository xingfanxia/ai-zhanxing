import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./posthog-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 占星 - Western Astrology & Tarot",
  description: "Discover the wisdom of the stars and the mysteries of tarot through AI-powered insights. Calculate your natal chart and receive personalized readings.",
  keywords: ["astrology", "tarot", "horoscope", "natal chart", "AI", "divination"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
