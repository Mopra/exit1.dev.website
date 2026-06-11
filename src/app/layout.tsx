import type { Metadata } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTABar from "@/components/StickyCTABar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import ClarityAnalytics from "@/components/ClarityAnalytics";
import { getGithubStars } from "@/lib/github";

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

// Dark theme tokens mirrored from the app (exit1.dev/src/style.css .dark block).
// Applied site-wide via the body wrapper so header, footer, and all pages
// inherit the app-aligned dark palette.
const appDarkTheme: React.CSSProperties & Record<string, string> = {
  "--background": "#0A0A0F",
  "--foreground": "oklch(0.9851 0 0)",
  "--card": "oklch(0.235 0.014 285)",
  "--card-foreground": "oklch(0.9851 0 0)",
  "--popover": "oklch(0.155 0.014 285)",
  "--popover-foreground": "oklch(0.9851 0 0)",
  "--primary": "oklch(0.5854 0.1022 167.0051)",
  "--primary-foreground": "oklch(1 0 0)",
  "--secondary": "oklch(0.235 0.014 285)",
  "--secondary-foreground": "oklch(0.9851 0 0)",
  "--muted": "oklch(0.278 0.014 285)",
  "--muted-foreground": "oklch(0.7090 0 0)",
  "--accent": "oklch(0.3715 0 0)",
  "--accent-foreground": "oklch(0.9851 0 0)",
  "--success": "oklch(0.78 0.17 152)",
  "--success-foreground": "oklch(0 0 0)",
  "--warning": "oklch(0.85 0.16 80)",
  "--warning-foreground": "oklch(0 0 0)",
  "--destructive": "oklch(0.7036 0.1881 22.1462)",
  "--destructive-foreground": "oklch(0.9851 0 0)",
  "--border": "oklch(0.2768 0 0)",
  "--input": "oklch(0.3250 0 0)",
  "--ring": "oklch(0.5854 0.1022 167.0051)",
};

const siteTitle = "Exit1.dev - Free Uptime Monitor & Free Website Monitor";
const siteDescription = "The best free uptime and website monitoring stack with API observability and instant alerts. 10 monitors free with 5-minute checks, unlimited with Nano. No credit card required.";

export const metadata: Metadata = {
  metadataBase: new URL("https://exit1.dev"),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: '/e_.svg',
    shortcut: '/e_.svg',
    apple: '/e_-logo.png',
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "https://exit1.dev",
    siteName: "Exit1.dev",
    images: [
      {
        url: "/e_-logo-large.png",
        width: 500,
        height: 500,
        alt: "Exit1.dev logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: ["/e_-logo-large.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const githubStars = await getGithubStars();

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager — lazyOnload keeps tag JS out of the
            LCP/TBT window; pageviews still fire once the page settles. */}
        <Script id="google-tag-manager" strategy="lazyOnload">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TPFBP3W4');
          `}
        </Script>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TW8WXE2TZP"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TW8WXE2TZP');
          `}
        </Script>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1282482619958596');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body
        style={appDarkTheme}
        className={`${dmSans.variable} ${spaceMono.variable} antialiased bg-background text-foreground`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TPFBP3W4"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1282482619958596&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header githubStars={githubStars} />
        <main id="main-content">
          {children}
        </main>
        <Footer />
        <StickyCTABar />
        <SpeedInsights />
        <ClarityAnalytics />
      </body>
    </html>
  );
}
