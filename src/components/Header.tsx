import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import { getHeaderContent } from '../utils/contentLoader';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const content = getHeaderContent();

  // Handle scroll to anchor after navigation
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, [location.hash]);

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
          className={`text-gray-600 hover:text-gray-900 transition-all duration-200 cursor-pointer font-mono ${
            isMobile 
              ? 'block px-3 py-2 text-sm font-medium w-full text-left rounded-xl hover:bg-gray-100/50' 
              : 'px-3 py-2 text-sm font-medium rounded-xl hover:bg-gray-100/50'
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
          className={`text-gray-600 hover:text-gray-900 transition-all duration-200 cursor-pointer font-mono ${
            isMobile 
              ? 'block px-3 py-2 text-sm font-medium rounded-xl hover:bg-gray-100/50' 
              : 'px-3 py-2 text-sm font-medium rounded-xl hover:bg-gray-100/50'
          }`}
          onClick={() => isMobile && setIsMenuOpen(false)}
        >
          {item.name}
        </Link>
      );
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="w-[90%] mx-auto py-4">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link to="/" className="text-gray-900 font-mono text-xl font-medium tracking-tight hover:text-gray-700 transition-all duration-200 cursor-pointer">
                    {content.logo}
                  </Link>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden xl:flex space-x-8">
                {content.navigation.map((item) => renderNavItem(item))}
              </nav>

              {/* CTA Buttons */}
              <div className="hidden xl:flex items-center space-x-3">
                <Button 
                  variant={content.cta.signIn.variant as any} 
                  size={content.cta.signIn.size as any}
                  href={content.cta.signIn.href}
                >
                  {content.cta.signIn.text}
                </Button>
                <Button 
                  variant={content.cta.startFree.variant as any} 
                  size={content.cta.startFree.size as any}
                  href={content.cta.startFree.href}
                >
                  {content.cta.startFree.text}
                </Button>
              </div>

              {/* Mobile CTA and menu button */}
              <div className="xl:hidden flex items-center space-x-3">
                <Button 
                  variant={content.cta.startFree.variant as any} 
                  size={content.cta.startFree.size as any}
                  href={content.cta.startFree.href}
                >
                  {content.cta.startFree.text}
                </Button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-gray-900 p-2 transition-all duration-200 cursor-pointer rounded-xl hover:bg-gray-100/50"
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
              <div className="xl:hidden mt-4 pt-4 border-t border-gray-200/50">
                <div className="space-y-2">
                  {content.navigation.map((item) => renderNavItem(item, true))}
                  <div className="pt-4 space-y-2">
                    <Button 
                      variant={content.cta.signIn.variant as any} 
                      size={content.cta.signIn.size as any} 
                      className="w-full"
                      href={content.cta.signIn.href}
                    >
                      {content.cta.signIn.text}
                    </Button>
                    <Button 
                      variant={content.cta.startFree.variant as any} 
                      size={content.cta.startFree.size as any} 
                      className="w-full"
                      href={content.cta.startFree.href}
                    >
                      {content.cta.startFree.text}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 