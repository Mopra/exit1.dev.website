'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import footerContent from '../content/footer.json';
import CookieSettings from './CookieSettings';

const Footer = () => {
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const content = footerContent;

  const renderLink = (item: { name: string; href: string }) => {
    if (item.href === '#cookie-settings') {
      // Cookie settings modal trigger
      return (
        <button
          onClick={() => setShowCookieSettings(true)}
          className="text-base text-muted-foreground hover:text-primary transition-colors duration-200 font-light cursor-pointer text-left interactive"
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
          className="text-base text-muted-foreground hover:text-primary transition-colors duration-200 font-light cursor-pointer text-left interactive"
        >
          {item.name}
        </button>
      );
    } else if (item.href.startsWith('/')) {
      // Internal Next.js link
      return (
        <Link
          href={item.href}
          className="text-base text-muted-foreground hover:text-primary transition-colors duration-200 font-light cursor-pointer interactive"
        >
          {item.name}
        </Link>
      );
    } else {
      // External link
      return (
        <a
          href={item.href}
          className="text-base text-muted-foreground hover:text-primary transition-colors duration-200 font-light cursor-pointer interactive"
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.name}
        </a>
      );
    }
  };

  return (
    <footer className="bg-background/50 backdrop-blur-md border-t border-primary/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8">
        {/* Mobile-first grid layout */}
        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Brand section - full width on mobile */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="text-foreground font-mono text-2xl font-semibold tracking-tight hover:text-primary transition-colors duration-200 cursor-pointer interactive">
              {content.brand.logo}
            </Link>
            <p className="text-muted-foreground text-base font-light leading-relaxed">
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
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
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
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
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
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
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
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
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
        <div className="mt-12 border-t border-primary/20 pt-8">
          <p className="text-base text-muted-foreground text-center lg:text-right font-light" 
             dangerouslySetInnerHTML={{ __html: content.copyright }}>
          </p>
        </div>
      </div>
      
      {/* Cookie Settings Modal */}
      <CookieSettings 
        isOpen={showCookieSettings} 
        onClose={() => setShowCookieSettings(false)} 
      />
    </footer>
  );
};

export default Footer;
