'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

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

  // Google Analytics 4
  injectExternal(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  injectInline(
    `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`
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
    if (loaded) return;

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
    return cleanup;
  }, []);

  return null;
}
