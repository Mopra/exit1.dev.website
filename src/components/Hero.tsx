import Button from './Button';
import AnimatedTerminal from './AnimatedTerminal';
import { getHeroContent } from '../utils/contentLoader';

const Hero = () => {
  const content = getHeroContent();

  return (
    <section id="hero" className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.02)_0%,transparent_50%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-8 leading-tight">
            {content.title.main}
            {content.title.highlight && (
              <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {' '}{content.title.highlight}
              </span>
            )}
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
            {content.subtitle}
          </p>
          
          {/* Description */}
          {content.description && (
            <p className="text-lg text-gray-500 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
              {content.description}
            </p>
          )}
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
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
          </div>
          
          {/* Animated Terminal Demo */}
          <div className="max-w-4xl mx-auto">
            <AnimatedTerminal title={content.terminal.title} />
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 text-gray-500">
            <p className="text-sm font-medium">
              {content.trustIndicator}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 