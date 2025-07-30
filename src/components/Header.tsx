import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getHeaderContent } from '../utils/contentLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const content = getHeaderContent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const productMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProductMenuOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (productMenuRef.current && !productMenuRef.current.contains(event.target as Node)) {
        setIsProductMenuOpen(false);
      }
    };

    if (isMenuOpen || isProductMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isProductMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsProductMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isMenuOpen || isProductMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen, isProductMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProductMenu = () => {
    setIsProductMenuOpen(!isProductMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigationClick = (href: string, e: React.MouseEvent) => {
    // Handle smooth scrolling for anchor links
    if (href.startsWith('#')) {
      e.preventDefault();
      
      // If we're not on the home page, navigate to home first
      if (location.pathname !== '/') {
        navigate(`/${href}`);
        return;
      }
      
      // If we're on the home page, scroll to the section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
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
          {content.navigation.map((item) => {
            if (item.href.startsWith('#')) {
              // Anchor link for smooth scrolling
              return (
                <button
                  key={item.href}
                  onClick={(e) => handleNavigationClick(item.href, e)}
                  className={`text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-full px-3 py-2 whitespace-nowrap ${
                    isActive(item.href)
                      ? 'text-gray-900 bg-gray-100/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                  }`}
                >
                  {item.name}
                </button>
              );
            } else if (item.href.startsWith('/')) {
              // Internal React Router link
              return (
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
              );
            } else {
              // External link
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-full px-3 py-2 whitespace-nowrap text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                </a>
              );
            }
          })}

          {/* Product Dropdown */}
          <div className="relative" ref={productMenuRef}>
            <button
              onClick={toggleProductMenu}
              className={`text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-full px-3 py-2 whitespace-nowrap flex items-center space-x-1 ${
                isProductMenuOpen || location.pathname.startsWith('/product')
                  ? 'text-gray-900 bg-gray-100/80'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
              aria-expanded={isProductMenuOpen}
              aria-haspopup="true"
            >
              <span>{content.productMenu.name}</span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`w-3 h-3 transition-transform duration-200 ${
                  isProductMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isProductMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-2xl z-50">
                <div className="p-4 space-y-2">
                  {content.productMenu.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block p-3 rounded-xl text-left hover:bg-gray-50/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      onClick={() => setIsProductMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900 mb-1">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
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
            {content.navigation.map((item) => {
              if (item.href.startsWith('#')) {
                // Anchor link for smooth scrolling
                return (
                  <button
                    key={item.href}
                    onClick={(e) => handleNavigationClick(item.href, e)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                      isActive(item.href)
                        ? 'text-gray-900 bg-gray-100/80'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              } else if (item.href.startsWith('/')) {
                // Internal React Router link
                return (
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
                );
              } else {
                // External link
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.name}
                  </a>
                );
              }
            })}

            {/* Mobile Product Menu */}
            <div className="border-t border-gray-200/50 pt-4">
              <div className="font-medium text-gray-900 mb-2 px-3">{content.productMenu.name}</div>
              {content.productMenu.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                </Link>
              ))}
            </div>
            
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