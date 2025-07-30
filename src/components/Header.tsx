import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getHeaderContent } from '../utils/contentLoader';

const Header = () => {
  const content = getHeaderContent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className="fixed top-4 left-4 right-4 z-50 transition-all duration-500 bg-white/90 backdrop-blur-xl rounded-2xl max-w-[1800px] mx-auto border border-gray-100 shadow-2xl"
      role="banner"
    >
      <div className="flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center text-gray-900 hover:text-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-lg"
          aria-label="Go to homepage"
        >
          <span className="font-mono font-semibold text-lg tracking-tight">exit1.dev</span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav 
          className="hidden xl:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2"
          role="navigation"
          aria-label="Main navigation"
        >
          {content.navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-full px-3 py-2 whitespace-nowrap ${
                isActive(item.href)
                  ? 'text-gray-900 bg-gray-100/80'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden xl:flex items-center space-x-2">
          <Link
            to={content.cta.signIn.href}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
          >
            {content.cta.signIn.text}
          </Link>
          <Link
            to={content.cta.startFree.href}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300 shadow-sm"
          >
            {content.cta.startFree.text}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="xl:hidden inline-flex items-center justify-center p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <svg
              className="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="xl:hidden"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="px-6 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-xl border-t border-gray-200/50">
            {content.navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                  isActive(item.href)
                    ? 'text-gray-900 bg-gray-100/80'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile CTA */}
            <div className="pt-4 pb-3 border-t border-gray-200/50 space-y-2">
              <Link
                to={content.cta.signIn.href}
                className="block w-full text-center px-4 py-2 text-base font-medium rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
              >
                {content.cta.signIn.text}
              </Link>
              <Link
                to={content.cta.startFree.href}
                className="block w-full text-center px-4 py-2 text-base font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300 shadow-sm"
              >
                {content.cta.startFree.text}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 