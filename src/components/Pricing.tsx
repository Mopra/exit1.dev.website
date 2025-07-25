import Button from './Button';
import { getPricingContent } from '../utils/contentLoader';

const Pricing = () => {
  const content = getPricingContent();

  return (
    <section id="pricing" className="bg-white py-32">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {content.plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white border rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-center min-h-[500px] ${
                plan.popular
                  ? 'border-gray-900 shadow-2xl shadow-gray-900/10'
                  : 'border-gray-200 shadow-lg hover:shadow-xl opacity-30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Coming Soon Overlay for Sudo Plan */}
              {!plan.popular && (
                <div className="absolute p-10 inset-0 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-black mb-2 py-2">Sudo version coming at some point...</div>
                    <div className="text-sm text-black">I'm working on it</div>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-light text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-2 text-lg">{plan.period}</span>
                </div>
                <p className="text-gray-600 font-light">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                size="lg"
                className="w-full"
                disabled={!plan.popular}
                href={plan.href}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing; 