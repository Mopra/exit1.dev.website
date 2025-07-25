import { Link } from 'react-router-dom';
import { getFooterContent } from '../utils/contentLoader';

const Footer = () => {
  const content = getFooterContent();

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
    }
  };

  const renderLink = (item: { name: string; href: string }) => {
    if (item.href.startsWith('#')) {
      // Anchor link for smooth scrolling
      return (
        <button
          onClick={(e) => handleNavigationClick(item.href, e)}
          className="text-base text-gray-600 hover:text-gray-900 transition-colors duration-200 font-light cursor-pointer text-left"
        >
          {item.name}
        </button>
      );
    } else if (item.href.startsWith('/')) {
      // Internal React Router link
      return (
        <Link
          to={item.href}
          className="text-base text-gray-600 hover:text-gray-900 transition-colors duration-200 font-light cursor-pointer"
        >
          {item.name}
        </Link>
      );
    } else {
      // External link
      return (
        <a
          href={item.href}
          className="text-base text-gray-600 hover:text-gray-900 transition-colors duration-200 font-light cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.name}
        </a>
      );
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="text-gray-900 font-mono text-2xl font-semibold tracking-tight hover:text-gray-700 transition-colors duration-200 cursor-pointer">
              {content.brand.logo}
            </Link>
            <p className="text-gray-600 text-base font-light leading-relaxed">
              {content.brand.description}
            </p>
            <div className="flex space-x-6">
              {content.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-900 transition-all duration-200 hover:scale-110 font-medium cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Product
                </h3>
                <ul className="mt-6 space-y-4">
                  {content.navigation.product.map((item) => (
                    <li key={item.name}>
                      {renderLink(item)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-6 space-y-4">
                  {content.navigation.company.map((item) => (
                    <li key={item.name}>
                      {renderLink(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-6 space-y-4">
                  {content.navigation.support.map((item) => (
                    <li key={item.name}>
                      {renderLink(item)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-6 space-y-4">
                  {content.navigation.legal.map((item) => (
                    <li key={item.name}>
                      {renderLink(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-500 xl:text-center font-light" 
             dangerouslySetInnerHTML={{ __html: content.copyright }}>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 