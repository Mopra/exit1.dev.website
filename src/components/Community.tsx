import Button from './Button';
import { getCommunityContent } from '../utils/contentLoader';

const Community = () => {
  const content = getCommunityContent();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'fa-regular fa-comments':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 13.75 2.5 15.4 3.36 16.81L2 22L7.19 20.64C8.6 21.5 10.25 22 12 22C17.52 22 22 17.52 22 12S17.52 2 12 2M12 20C10.54 20 9.18 19.65 8 19L3 20L4 15C3.35 13.82 3 12.46 3 11C3 7.13 7.13 3 11 3S19 7.13 19 11S14.87 19 11 19M7 8H17V10H7V8M7 12H17V14H7V12Z"/>
          </svg>
        );
      case 'fa-regular fa-lightbulb':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C15.31 2 18 4.69 18 8C18 10.5 16.5 12.67 14.31 13.37V15H15V17H9V15H9.69V13.37C7.5 12.67 6 10.5 6 8C6 4.69 8.69 2 12 2M12 4C9.79 4 8 5.79 8 8C8 9.85 9.23 11.41 10.94 11.87L12 12.11L13.06 11.87C14.77 11.41 16 9.85 16 8C16 5.79 14.21 4 12 4M10 19H14V21H10V19Z"/>
          </svg>
        );
      case 'fa-regular fa-star':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
          </svg>
        );
      case 'fa-brands fa-discord':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.32 4.37C18.94 3.74 17.47 3.29 15.94 3.02C15.94 3.02 15.92 3.02 15.91 3.03C15.74 3.33 15.55 3.72 15.42 4.03C13.8 3.79 12.2 3.79 10.58 4.03C10.45 3.72 10.26 3.33 10.09 3.03C10.08 3.02 10.06 3.02 10.06 3.02C8.53 3.29 7.06 3.74 5.68 4.37C5.67 4.37 5.66 4.38 5.65 4.38C2.78 8.84 2.02 13.19 2.42 17.49C2.42 17.5 2.43 17.51 2.44 17.52C4.31 18.89 6.12 19.72 7.89 20.26C7.9 20.26 7.91 20.26 7.92 20.25C8.29 19.74 8.62 19.2 8.91 18.63C8.92 18.61 8.91 18.59 8.89 18.58C8.36 18.38 7.85 18.14 7.36 17.86C7.34 17.85 7.34 17.82 7.35 17.8C7.45 17.73 7.55 17.65 7.65 17.58C7.66 17.57 7.68 17.57 7.69 17.57C11.43 19.27 15.58 19.27 19.28 17.57C19.29 17.57 19.31 17.57 19.32 17.58C19.42 17.65 19.52 17.73 19.62 17.8C19.64 17.82 19.63 17.85 19.61 17.86C19.12 18.14 18.61 18.38 18.08 18.58C18.06 18.59 18.05 18.61 18.06 18.63C18.35 19.2 18.68 19.74 19.05 20.25C19.06 20.26 19.07 20.26 19.08 20.25C20.85 19.72 22.66 18.89 24.53 17.52C24.54 17.51 24.55 17.5 24.55 17.49C25.02 12.54 23.74 8.23 20.34 4.38C20.33 4.38 20.32 4.37 20.32 4.37ZM8.85 14.88C7.68 14.88 6.7 13.79 6.7 12.46C6.7 11.13 7.66 10.04 8.85 10.04C10.04 10.04 11.02 11.13 11 12.46C11 13.79 10.04 14.88 8.85 14.88ZM17.12 14.88C15.95 14.88 14.97 13.79 14.97 12.46C14.97 11.13 15.93 10.04 17.12 10.04C18.31 10.04 19.29 11.13 19.27 12.46C19.27 13.79 18.31 14.88 17.12 14.88Z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
          </svg>
        );
    }
  };

  return (
    <section id="community" className="relative bg-white py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.02)_0%,transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-gray-200 rounded-2xl mb-8 shadow-sm">
            <svg className="w-8 h-8 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 leading-tight">
            Help Us{' '}
            <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Build
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8 font-light">
            We're building for developers. Your feedback helps shape Exit1.dev into the monitoring service developers actually want to use.
          </p>
          <div className="inline-flex items-center bg-gray-100 border border-gray-200 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
            <span className="text-gray-600 text-sm font-medium">Free service • Community-driven • Built for developers</span>
          </div>
        </div>

        {/* Contribution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          {content.features.map((feature, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="relative bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-xl">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <span className="text-white">
                      {getIcon(feature.icon)}
                    </span>
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 max-w-4xl mx-auto shadow-lg">
            <h3 className="text-3xl font-semibold text-gray-900 mb-6">Ready to get involved?</h3>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join our community. Share feedback. Request features. Help us build the monitoring service developers deserve.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                variant="primary"
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                href={content.cta.primary.href}
              >
                {content.cta.primary.text}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium transition-all duration-300"
                href={content.cta.secondary.href}
              >
                {content.cta.secondary.text}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium transition-all duration-300"
                href={content.cta.discord.href}
              >
                {content.cta.discord.text}
              </Button>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              Free service • Community feedback • Direct access to developers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community; 