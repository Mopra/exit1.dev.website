import { Helmet } from 'react-helmet-async';
import Button from '../components/Button';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const QuickStart = () => {
  const { elementRef, isIntersecting } = useIntersectionObserver();

  return (
    <>
      <Helmet>
        <title>How to Set Up Free Website Monitoring in 30 Seconds | exit1.dev</title>
        <meta name="description" content="Learn how to set up free website monitoring in 30 seconds. No credit card required, unlimited websites, 1-minute checks. Start monitoring immediately with exit1.dev." />
        <meta name="keywords" content="how to set up free website monitoring, free website monitoring setup, website monitoring tutorial, free uptime monitoring guide" />
        <link rel="canonical" href="https://exit1.dev/quick-start" />
        
        {/* Open Graph */}
        <meta property="og:title" content="How to Set Up Free Website Monitoring in 30 Seconds" />
        <meta property="og:description" content="Learn how to set up free website monitoring in 30 seconds. No credit card required, unlimited websites, 1-minute checks." />
        <meta property="og:url" content="https://exit1.dev/quick-start" />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card */}
        <meta name="twitter:title" content="How to Set Up Free Website Monitoring in 30 Seconds" />
        <meta name="twitter:description" content="Learn how to set up free website monitoring in 30 seconds. No credit card required, unlimited websites, 1-minute checks." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Set Up Free Website Monitoring in 30 Seconds",
            "description": "Complete guide to setting up free website monitoring with exit1.dev",
            "image": "https://exit1.dev/og-image.jpg",
            "totalTime": "PT30S",
            "estimatedCost": {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": "0"
            },
            "supply": [
              {
                "@type": "HowToSupply",
                "name": "Website URL"
              }
            ],
            "tool": [
              {
                "@type": "HowToTool",
                "name": "exit1.dev"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Sign Up Free",
                                 "text": "Visit app.exit1.dev. No credit card required, no verification emails.",
                 "url": "https://app.exit1.dev/"
              },
              {
                "@type": "HowToStep", 
                "name": "Add Your Website",
                "text": "Paste your website URL. We start monitoring immediately with 1-minute checks."
              },
              {
                "@type": "HowToStep",
                "name": "Get Instant Alerts", 
                "text": "Connect webhooks to Discord/Slack or get email alerts when your site goes down."
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                How to Set Up Free Website Monitoring in{' '}
                <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  30 Seconds
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Complete guide to getting free website monitoring with unlimited sites, 1-minute checks, and instant alerts. No credit card required.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Quick Answer */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
              Quick Answer: How to Set Up Free Website Monitoring
            </h2>
            <ol className="text-blue-800 space-y-3">
              <li className="flex items-start">
                <span className="font-semibold mr-3">1.</span>
                                 <span>Visit <a href="https://app.exit1.dev/" className="underline hover:no-underline">app.exit1.dev</a> (no credit card required)</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-3">2.</span>
                <span>Add your website URL to start monitoring immediately</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-3">3.</span>
                <span>Get instant alerts via webhooks or email when your site goes down</span>
              </li>
            </ol>
          </div>

          {/* Detailed Steps */}
          <div className="space-y-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-semibold mr-4">
                  1
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Sign Up Free (No Credit Card Required)</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-4">
                  Unlike other "free" monitoring services that require a credit card, exit1.dev is truly free. Here's how to get started:
                </p>
                <ul className="space-y-2 text-gray-700">
                                     <li>• Visit <a href="https://app.exit1.dev/" className="text-blue-600 hover:text-blue-800 underline">app.exit1.dev</a></li>
                  <li>• No credit card information required</li>
                  <li>• No verification emails to wait for</li>
                  <li>• No phone number needed</li>
                  <li>• Start monitoring immediately</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-semibold mr-4">
                  2
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Add Your Website URL</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-4">
                  Once you're signed up, adding your first website takes just a few seconds:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Paste your website URL (e.g., https://mywebsite.com)</li>
                  <li>• We automatically start 1-minute monitoring checks</li>
                  <li>• Monitor unlimited websites (no limits like UptimeRobot's 50-site cap)</li>
                  <li>• Get real-time status updates</li>
                  <li>• View response times and uptime statistics</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-semibold mr-4">
                  3
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Configure Instant Alerts</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-4">
                  Set up notifications to get alerted immediately when your website goes down:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Webhook Alerts:</strong> Connect to Discord, Slack, or any custom endpoint</li>
                  <li>• <strong>Email Alerts:</strong> Get notified via email when sites go down or come back up</li>
                  <li>• <strong>Instant Notifications:</strong> No delays like 5-minute intervals from competitors</li>
                  <li>• <strong>SSL Monitoring:</strong> Get alerts before SSL certificates expire</li>
                  <li>• <strong>API Monitoring:</strong> Monitor REST APIs and endpoints</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Why Choose exit1.dev */}
          <div className="mt-16 bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Why Choose exit1.dev for Free Website Monitoring?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">vs UptimeRobot</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Unlimited websites (vs 50 limit)</li>
                  <li>• 1-minute checks (vs 5-minute)</li>
                  <li>• No credit card required</li>
                  <li>• Better alert options</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">vs Pingdom</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Unlimited websites (vs 1 site)</li>
                  <li>• Same 1-minute check frequency</li>
                  <li>• No credit card required</li>
                  <li>• Terminal interface for developers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-light text-gray-900 mb-6">
              Ready to Start Free Monitoring?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and businesses who trust exit1.dev for their website monitoring needs.
            </p>
            <Button 
              variant="primary"
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                             href="https://app.exit1.dev/"
            >
              Start Free Monitoring Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickStart; 