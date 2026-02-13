'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import footerContent from '../content/footer.json';
import CookieSettings from './CookieSettings';
import { PageContainer } from "@/components/PageLayout";

const Footer = () => {
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const content = footerContent;

  const renderLink = (item: { name: string; href: string }) => {
    if (item.href === '#cookie-settings') {
      // Cookie settings modal trigger
      return (
        <button
          onClick={() => setShowCookieSettings(true)}
          className="text-base text-white/70 hover:text-white transition-colors duration-200 font-light cursor-pointer text-left interactive"
        >
          {item.name}
        </button>
      );
    } else if (item.href.startsWith('#')) {
      // Anchor link for smooth scrolling
      return (
        <button
          onClick={() => {
            const element = document.querySelector(item.href);
            if (element) {
              element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }}
          className="text-base text-white/70 hover:text-white transition-colors duration-200 font-light cursor-pointer text-left interactive"
        >
          {item.name}
        </button>
      );
    } else if (item.href.startsWith('/')) {
      // Internal Next.js link
      return (
        <Link
          href={item.href}
          className="text-base text-white/70 hover:text-white transition-colors duration-200 font-light cursor-pointer interactive"
        >
          {item.name}
        </Link>
      );
    } else {
      // External link
      return (
        <a
          href={item.href}
          className="text-base text-white/70 hover:text-white transition-colors duration-200 font-light cursor-pointer interactive"
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.name}
        </a>
      );
    }
  };

  return (
    <footer className="bg-black text-white">
      <PageContainer>
        <div className="border-inset-top px-6 lg:px-8">
          <div className="py-12 sm:py-16 lg:py-20">
        {/* Mobile-first grid layout */}
        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Brand section - full width on mobile */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="text-white font-mono text-2xl font-semibold tracking-tight hover:text-white/80 transition-colors duration-200 cursor-pointer interactive">
              {content.brand.logo}
            </Link>
            <p className="text-white/70 text-base font-light leading-relaxed">
              {content.brand.description}
            </p>
            
            {/* Peerpush Achievement Badge */}
            <div className="pt-2">
              <a
                href="https://peerpush.net/p/exit1dev"
                target="_blank"
                rel="noopener"
                className="inline-block transition-all duration-300 hover:scale-105 cursor-pointer interactive"
                style={{ height: '40px' }}
              >
                <Image
                  src="https://peerpush.net/p/exit1dev/badge"
                  alt="Exit1.dev badge"
                  width={160}
                  height={40}
                  style={{ height: '40px' }}
                  className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </a>
            </div>
          </div>
          
          {/* Navigation sections - stacked on mobile, grid on larger screens */}
          <div className="space-y-8 lg:col-span-2 lg:grid lg:grid-cols-4 lg:gap-8 lg:space-y-0">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                Monitoring
              </h3>
              <ul className="mt-4 space-y-3">
                {content.navigation.monitoring.map((item) => (
                  <li key={item.name}>
                    {renderLink(item)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                Analytics & Tools
              </h3>
              <ul className="mt-4 space-y-3">
                {content.navigation.analytics.map((item) => (
                  <li key={item.name}>
                    {renderLink(item)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-3">
                {content.navigation.support.map((item) => (
                  <li key={item.name}>
                    {renderLink(item)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                {content.navigation.legal.map((item) => (
                  <li key={item.name}>
                    {renderLink(item)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
{/* Copyright - centered on mobile, right-aligned on larger screens */}
          <div className="mt-12 border-inset-top pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-4">
{/* Made in EU badge */}
              <div className="flex items-center gap-3">
                <Image
                  src="/eu.svg"
                  alt="European Union flag"
                  width={60}
                  height={40}
                  className="rounded"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#003399]">Made and hosted in the</span>
                  <span className="text-sm font-bold text-[#003399]">European Union</span>
                </div>
              </div>
              
              {/* Business info and Copyright */}
              <div className="flex flex-col items-center lg:items-end gap-1">
                <p className="text-sm text-white/50 font-light">
                  Pradsgaard Labs EMV | CVR: DK46156153
                </p>
                <p className="text-base text-white/60 font-light"
                 dangerouslySetInnerHTML={{ __html: content.copyright }}>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
      
      {/* Cookie Settings Modal */}
      <CookieSettings 
        isOpen={showCookieSettings} 
        onClose={() => setShowCookieSettings(false)} 
      />
    </footer>
  );
};

export default Footer;
