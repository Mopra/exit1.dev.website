import Button from './Button';
import { getHowItWorksContent } from '../utils/contentLoader';

const HowItWorks = () => {
  const content = getHowItWorksContent();

  return (
    <section id="how-it-works" className="bg-gradient-to-br from-gray-50 to-gray-100 py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
            {content.title.main}{' '}
            <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {content.title.highlight}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {content.steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <div className="text-gray-900 text-2xl font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gray-900 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">{step.number}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <div className="bg-white border border-gray-200 rounded-2xl p-12 max-w-4xl mx-auto shadow-xl">
            <h3 className="text-3xl font-light text-gray-900 mb-6">
              {content.cta.title}
            </h3>
            <p className="text-gray-600 mb-8 text-lg font-light">
              {content.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {content.cta.buttons.map((button, index) => (
                <Button 
                  key={index} 
                  variant={button.variant as any}
                  href={button.href}
                  className={button.className}
                >
                  {button.text}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 