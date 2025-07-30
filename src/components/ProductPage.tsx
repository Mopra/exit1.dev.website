import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import SEO from './SEO';

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface ProductPageProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage?: string;
  features: Feature[];
  ctaText: string;
  ctaHref: string;
  seoTitle?: string;
  seoDescription?: string;
}

const ProductPage: React.FC<ProductPageProps> = ({
  title,
  subtitle,
  description,
  heroImage,
  features,
  ctaText,
  ctaHref,
  seoTitle,
  seoDescription
}) => {
  return (
    <>
      <Helmet>
        <title>{seoTitle || `${title} - exit1.dev`}</title>
        <meta name="description" content={seoDescription || description} />
        <meta property="og:title" content={seoTitle || `${title} - exit1.dev`} />
        <meta property="og:description" content={seoDescription || description} />
        <meta name="twitter:title" content={seoTitle || `${title} - exit1.dev`} />
        <meta name="twitter:description" content={seoDescription || description} />
      </Helmet>
             <SEO />
       
       <main className="pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {subtitle}
              </p>
              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={ctaHref}
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  {ctaText}
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-4 h-4" />
                </a>
                <a
                  href="https://app.exit1.dev"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white hover:bg-gray-50 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to monitor your infrastructure effectively
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50/50 rounded-2xl p-8 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                >
                  {feature.icon && (
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                      <FontAwesomeIcon icon={feature.icon as any} className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers who trust exit1.dev for their monitoring needs
            </p>
            <a
              href={ctaHref}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white hover:bg-gray-100 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {ctaText}
              <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-4 h-4" />
            </a>
          </div>
                 </section>
       </main>
     </>
  );
};

export default ProductPage; 