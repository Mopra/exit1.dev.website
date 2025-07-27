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
      case 'fa-brands fa-github':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21C9.5 20.77 9.5 20.14 9.5 19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26C14.5 19.6 14.5 20.68 14.5 21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 6.48 17.52 2 12 2Z"/>
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
    <section id="community" className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-100 py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.8)_0%,transparent_50%)]"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/80 backdrop-blur-sm rounded-3xl mb-8 border border-blue-200/50 shadow-xl">
            <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
              Launch Crew
            </span>
            <br />
            <span className="font-light">Wanted</span>
          </h2>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8 font-light">
            We're building something special, and we need visionaries like you to help shape the future of website monitoring.
          </p>
          <div className="inline-flex items-center bg-blue-100/50 backdrop-blur-sm border border-blue-200/50 rounded-full px-8 py-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 animate-pulse"></div>
            <span className="text-blue-700 font-medium">Early bird perks • Direct access to founders • Shape the product</span>
          </div>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          {content.features.map((feature, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="relative bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-3xl p-8 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-blue-300/50">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
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
          <div className="bg-white/50 backdrop-blur-sm border border-blue-200/50 rounded-3xl p-12 max-w-4xl mx-auto shadow-xl">
            <h3 className="text-3xl font-semibold text-gray-900 mb-6">Ready to Shape the Future?</h3>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join our mission to create the most developer-friendly monitoring platform. Your feedback shapes the product, and you get early access to all features.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                href={content.cta.primary.href}
              >
                {content.cta.primary.text}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold transition-all duration-300"
                href={content.cta.secondary.href}
              >
                {content.cta.secondary.text}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold transition-all duration-300"
                href={content.cta.discord.href}
              >
                {content.cta.discord.text}
              </Button>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              🚀 Early adopters get lifetime perks • 💬 Direct line to the founders • 🎯 Influence product roadmap
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community; 