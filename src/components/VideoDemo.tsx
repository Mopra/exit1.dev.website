import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import Button from './Button';

const VideoDemo = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { elementRef, isIntersecting } = useIntersectionObserver();

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
            See It In
            <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent ml-3">
              Action
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Watch how easy it is to monitor your websites with exit1.dev
          </p>
        </div>

        {/* Video Demo Section */}
        <div className="max-w-4xl mx-auto" ref={elementRef}>
          <div className="relative bg-black border border-gray-700 rounded-lg p-0 font-mono text-sm shadow-2xl overflow-hidden">
            {/* Video Header - matching terminal style */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-xl border-b border-gray-700/30 shadow-lg">
              <span className="text-gray-300 text-xs font-medium">exit1.dev demo</span>
              <div className="text-gray-500 text-xs">live preview</div>
            </div>
            
            {/* Video Container with loading state */}
            <div className="relative bg-black aspect-video">
              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-gray-400 text-sm">Loading demo...</div>
                </div>
              )}
              
              {isIntersecting && (
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
                  <source src="https://i.gyazo.com/edf62e3741cdb318aafce436abbf4f7f.mp4" type="video/mp4"/>
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to monitor your websites with 1-minute intervals for free?
          </p>
          <Button
            variant="primary"
            size="lg"
            href="https://app.exit1.dev/sign-up"
            className="bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Monitoring Free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoDemo; 