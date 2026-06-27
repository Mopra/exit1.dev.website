'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';
import { isAppSignupUrl, parseCtaParams, trackSignupClick } from '@/lib/analytics';

const GTM_ID = 'GTM-TPFBP3W4';
const GA_ID = 'G-TW8WXE2TZP';
const META_PIXEL_ID = '1282482619958596';
const CLARITY_PROJECT_ID = 'sn0wwajt10';

// Tags load on the visitor's first interaction (scroll, tap, key) or after
// this fallback so non-interacting visitors are still counted. Anything
// earlier — including `lazyOnload`/idle callbacks — executes inside the
// Lighthouse TBT window on throttled mobile and tanks the score.
const FALLBACK_DELAY_MS = 12_000;

const injectExternal = (src: string) => {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
};

const injectInline = (code: string) => {
  const s = document.createElement('script');
  s.textContent = code;
  document.head.appendChild(s);
};

let loaded = false;

function loadThirdParties() {
  if (loaded) return;
  loaded = true;

  // Google Tag Manager
  injectInline(
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`
  );

  // Google Analytics 4 — `linker.domains` enables cross-domain measurement so a
  // visitor who clicks through to app.exit1.dev stays in the same GA4 session
  // (gtag auto-decorates outbound links to these hosts with the _gl param).
  injectExternal(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  injectInline(
    `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{linker:{domains:['exit1.dev','app.exit1.dev']}});`
  );

  // Meta Pixel
  injectInline(
    `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`
  );

  // Microsoft Clarity
  Clarity.init(CLARITY_PROJECT_ID);
}

const TRIGGER_EVENTS: (keyof WindowEventMap)[] = [
  'pointerdown',
  'keydown',
  'touchstart',
  'wheel',
  'scroll',
];

export default function DeferredAnalytics() {
  useEffect(() => {
    // Conversion tracking: fire a GA4 sign_up_click whenever a visitor clicks a
    // CTA into the app. Kept for the component's lifetime so the click is caught
    // whenever it happens — not torn down with the one-shot load triggers below.
    const onSignupClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.('a');
      const href = anchor?.getAttribute('href');
      if (!href || !isAppSignupUrl(href)) return;
      // A click is itself an interaction, so the triggers below also fire; load
      // the tags first so the event queues after gtag('config'), not before it.
      loadThirdParties();
      trackSignupClick(parseCtaParams(href));
    };
    document.addEventListener('click', onSignupClick, true);

    // Load third-party tags on the first interaction, or after the fallback.
    let triggerCleanup = () => {};
    if (!loaded) {
      const cleanup = () => {
        window.clearTimeout(timer);
        TRIGGER_EVENTS.forEach((e) => window.removeEventListener(e, fire));
      };
      const fire = () => {
        cleanup();
        loadThirdParties();
      };
      const timer = window.setTimeout(fire, FALLBACK_DELAY_MS);
      TRIGGER_EVENTS.forEach((e) =>
        window.addEventListener(e, fire, { passive: true })
      );
      triggerCleanup = cleanup;
    }

    return () => {
      triggerCleanup();
      document.removeEventListener('click', onSignupClick, true);
    };
  }, []);

  return null;
}
