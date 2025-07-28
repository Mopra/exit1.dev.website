import { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface Screenshot {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

const screenshots: Screenshot[] = [
  {
    id: 1,
    src: '/screenshots/screenshot-1.png',
    alt: 'Manage hundreds of checks with ease',
    title: 'Manage hundreds of checks with ease',
    description: ''
  },
  {
    id: 2,
    src: '/screenshots/screenshot-2.png',
    alt: 'Analytics and insights',
    title: 'Analytics and insights',
    description: 'Powerful CLI for developers who prefer command-line tools'
  },
  {
    id: 3,
    src: '/screenshots/screenshot-3.png',
    alt: 'Analytics and insights',
    title: 'Analytics and insights',
    description: ''
  },
  {
    id: 4,
    src: '/screenshots/screenshot-4.png',
    alt: 'Incident log and reporting',
    title: 'Incident log and reporting',
    description: ''
  },
  {
    id: 5,
    src: '/screenshots/screenshot-5.png',
    alt: 'Incident log and reporting',
    title: 'Incident log and reporting',
    description: ''
  }
];

const ScreenshotGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);


  const { elementRef, isIntersecting } = useIntersectionObserver();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isIntersecting) {
      setIsVisible(true);
      
      // Only start auto-rotation if not paused
      if (!isPaused) {
        intervalRef.current = setInterval(() => {
          setActiveIndex((prev) => (prev + 1) % screenshots.length);
        }, 4000);
      }
    } else {
      setIsVisible(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isIntersecting]);

  // Separate effect for pause state
  useEffect(() => {
    if (isIntersecting) {
      if (isPaused) {
        // Clear interval when paused
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        // Start interval when not paused
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          setActiveIndex((prev) => (prev + 1) % screenshots.length);
        }, 4000);
      }
    }
  }, [isPaused, isIntersecting, activeIndex]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    // Reset the auto-rotation timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % screenshots.length);
      }, 4000);
    }
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    if (isIntersecting) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % screenshots.length);
      }, 4000);
    }
  };

  return (
    <section className="bg-white py-32 overflow-hidden" ref={elementRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
            Beautiful
            <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent ml-3">
              Interface
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Experience the power of exit1.dev through our intuitive and modern interface
          </p>
        </div>

        {/* Screenshot Gallery */}
        <div className="relative">
          {/* Main Screenshot Display */}
          <div 
            className="relative max-w-6xl mx-auto mb-12"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className={`transition-all duration-1000 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Screenshot Container with Apple-style shadow */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Screenshot Header */}
                <div className="bg-gray-100 px-6 py-3 flex items-center justify-center">
                  <div className="text-gray-500 text-sm font-medium">
                    {screenshots[activeIndex].title}
                  </div>
                </div>
                
                {/* Screenshot Image */}
                <div className="relative aspect-[16/10] bg-gray-50">
                  <img
                    src={screenshots[activeIndex].src}
                    alt={screenshots[activeIndex].alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback for missing images
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  
                  {/* Pause Icon Overlay */}
                  {isPaused && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl">
                        <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  {/* Fallback placeholder */}
                  <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">{screenshots[activeIndex].title}</p>
                      <p className="text-gray-400 text-sm mt-1">Screenshot {activeIndex + 1}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Navigation Dots */}
          <div 
            className={`flex justify-center space-x-3 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-gray-900 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>


        </div>
      </div>
    </section>
  );
};

export default ScreenshotGallery; 