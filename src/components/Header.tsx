import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { getHeaderContent } from '../utils/contentLoader';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const content = getHeaderContent();

  const handleNavigationClick = (href: string, e: React.MouseEvent) => {
    // Handle smooth scrolling for anchor links
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
      // Close mobile menu if open
      setIsMenuOpen(false);
    }
  };

  const renderNavItem = (item: { name: string; href: string }, isMobile = false) => {
    if (item.href.startsWith('#')) {
      // Anchor link for smooth scrolling
      return (
        <button
          key={item.name}
          onClick={(e) => handleNavigationClick(item.href, e)}
          className={`text-gray-600 hover:text-gray-900 transition-all duration-200 cursor-pointer ${
            isMobile 
              ? 'block px-3 py-2 text-base font-medium w-full text-left' 
              : 'px-3 py-2 text-sm font-medium hover:scale-105'
          }`}
        >
          {item.name}
        </button>
      );
    } else {
      // Regular navigation link
      return (
        <Link
          key={item.name}
          to={item.href}
          className={`text-gray-600 hover:text-gray-900 transition-all duration-200 cursor-pointer ${
            isMobile 
              ? 'block px-3 py-2 text-base font-medium' 
              : 'px-3 py-2 text-sm font-medium hover:scale-105'
          }`}
          onClick={() => isMobile && setIsMenuOpen(false)}
        >
          {item.name}
        </Link>
      );
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-gray-900 font-mono text-xl font-semibold tracking-tight hover:text-gray-700 transition-colors duration-200 cursor-pointer">
                {content.logo}
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {content.navigation.map((item) => renderNavItem(item))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              variant={content.cta.signIn.variant as any} 
              size={content.cta.signIn.size as any}
            >
              {content.cta.signIn.text}
            </Button>
            <Button 
              variant={content.cta.startFree.variant as any} 
              size={content.cta.startFree.size as any}
            >
              {content.cta.startFree.text}
            </Button>
          </div>

                    {/* Mobile CTA and menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <Button 
              variant={content.cta.startFree.variant as any} 
              size={content.cta.startFree.size as any}
            >
              {content.cta.startFree.text}
            </Button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 transition-colors duration-200 cursor-pointer"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
              {content.navigation.map((item) => renderNavItem(item, true))}
              <div className="pt-4 space-y-2">
                <Button 
                  variant={content.cta.signIn.variant as any} 
                  size={content.cta.signIn.size as any} 
                  className="w-full"
                >
                  {content.cta.signIn.text}
                </Button>
                <Button 
                  variant={content.cta.startFree.variant as any} 
                  size={content.cta.startFree.size as any} 
                  className="w-full"
                >
                  {content.cta.startFree.text}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 