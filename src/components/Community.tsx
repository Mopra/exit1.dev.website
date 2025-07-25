import Button from './Button';
import { getCommunityContent } from '../utils/contentLoader';

const Community = () => {
  const content = getCommunityContent();

  const getIconText = (iconName: string) => {
    switch (iconName) {
      case 'fa-regular fa-comments':
        return '💬';
      case 'fa-regular fa-lightbulb':
        return '💡';
      case 'fa-brands fa-github':
        return '🐙';
      case 'fa-brands fa-discord':
        return '🎮';
      default:
        return '✨';
    }
  };

  return (
    <section id="community" className="relative bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            {content.title}
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            {content.subtitle}
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {content.features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">
                  {getIconText(feature.icon)}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button
            variant={content.cta.primary.variant as any}
            size={content.cta.primary.size as any}
            className={content.cta.primary.className}
            href={content.cta.primary.href}
          >
            {content.cta.primary.text}
          </Button>
          <Button
            variant={content.cta.secondary.variant as any}
            size={content.cta.secondary.size as any}
            className={content.cta.secondary.className}
            href={content.cta.secondary.href}
          >
            {content.cta.secondary.text}
          </Button>
          <Button
            variant={content.cta.discord.variant as any}
            size={content.cta.discord.size as any}
            className={content.cta.discord.className}
            href={content.cta.discord.href}
          >
            {content.cta.discord.text}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Community; 