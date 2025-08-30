import type { Metadata } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PerformanceMonitor from "@/components/PerformanceMonitor";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif']
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  preload: true,
  fallback: ['monospace']
});

export const metadata: Metadata = {
  title: "Exit1.dev - Free Uptime Monitor for Unlimited Websites",
  description: "The best free uptime monitor with 1-minute checks, unlimited websites, and instant alerts. No credit card required. Professional monitoring for websites, APIs, and SSL certificates.",
  icons: {
    icon: '/e_.svg',
    shortcut: '/e_.svg',
    apple: '/e_.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${spaceMono.variable} antialiased`}
      >
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">
          {children}
        </main>
        <Footer />
        <SpeedInsights />
        <PerformanceMonitor />
      </body>
    </html>
  );
}
