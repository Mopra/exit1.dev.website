import Button from './Button';
import { getHeroContent } from '../utils/contentLoader';
import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Hero = () => {
  const content = getHeroContent();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const { elementRef, isIntersecting } = useIntersectionObserver();

  // Delay video loading to prioritize critical content
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section 
      id="hero" 
      className="hero-section relative bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.02)_0%,transparent_50%)]"
        aria-hidden="true"
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Main Headline */}
          <h1 
            id="hero-heading"
            className="text-5xl md:text-7xl font-light text-gray-900 mb-8 leading-tight"
          >
            {content.title.main}
            {content.title.highlight && (
              <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {' '}{content.title.highlight}
              </span>
            )}
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-700 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
            {content.subtitle}
          </p>
          
          {/* Description */}
          {content.description && (
            <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
              {content.description}
            </p>
          )}
          
          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            role="group"
            aria-label="Call to action buttons"
          >
            <Button 
              variant={content.cta.primary.variant as any} 
              size={content.cta.primary.size as any} 
              className={content.cta.primary.className}
              href={content.cta.primary.href}
              aria-describedby="hero-heading"
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
          
          {/* Video Demo - Lazy loaded */}
          <div className="max-w-4xl mx-auto" ref={elementRef}>
            <div className="relative bg-black border border-gray-700 rounded-lg p-0 font-mono text-sm shadow-2xl overflow-hidden">
              {/* Video Header - matching terminal style */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-xl border-b border-gray-700/30 shadow-lg">
                <span className="text-gray-300 text-xs font-medium">exit1.dev demo</span>
                <div className="text-gray-500 text-xs">live preview</div>
              </div>
              
              {/* Video Container with optimized loading */}
              <div className="relative bg-black aspect-video">
                {!isVideoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-gray-400 text-sm">Loading demo...</div>
                  </div>
                )}
                
                {isIntersecting && shouldLoadVideo && (
                  <video 
                    width="100%" 
                    height="100%"
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                    onLoadedData={handleVideoLoad}

                  >
                    <source src="https://i.gyazo.com/e6eebbf9d03d508a364c940a4d5eecc9.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 text-gray-600">
            <p className="text-sm font-medium">
              {content.trustIndicator}
            </p>
          </div>
          
          {/* How to Section */}
          {content.howToSection && (
            <div className="mt-20 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-12 text-center">
                {content.howToSection.title}
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {content.howToSection.steps.map((step, index) => (
                  <div 
                    key={index}
                    className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button 
                  variant="primary"
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  href={content.howToSection.cta.href}
                >
                  {content.howToSection.cta.text}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero; 