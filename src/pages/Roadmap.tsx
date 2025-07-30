interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  features: string[];
}

const roadmapData: RoadmapItem[] = [
  {
    id: '1',
    title: 'Advanced Analytics Dashboard',
    description: 'Comprehensive analytics with real-time insights and custom reporting',
    features: [
      'Real-time performance metrics',
      'Custom alert thresholds',
      'Historical data analysis',
      'Export capabilities'
    ]
  },
  {
    id: '2',
    title: 'Multi-Platform Monitoring',
    description: 'Extend monitoring to mobile apps and APIs',
    features: [
      'iOS app monitoring',
      'Android app monitoring',
      'API endpoint tracking',
      'Mobile crash reporting'
    ]
  },
  {
    id: '3',
    title: 'Advanced Security Features',
    description: 'Enhanced security monitoring and threat detection',
    features: [
      'SSL certificate monitoring',
      'Security vulnerability scanning',
      'DDoS protection alerts',
      'Malware detection'
    ]
  },
  {
    id: '4',
    title: 'Team Collaboration Tools',
    description: 'Built-in team management and collaboration features',
    features: [
      'Team member roles',
      'Shared dashboards',
      'Comment system',
      'Activity logs'
    ]
  },
  {
    id: '5',
    title: 'Smart Notifications',
    description: 'AI-powered intelligent alerting system',
    features: [
      'Smart alert grouping',
      'Escalation rules',
      'Notification preferences',
      'Alert history'
    ]
  },
  {
    id: '6',
    title: 'Global Monitoring Network',
    description: 'Monitor from multiple global locations',
    features: [
      'Multi-region monitoring',
      'Geographic performance data',
      'CDN optimization insights',
      'Global uptime tracking'
    ]
  },
  {
    id: '7',
    title: 'Advanced Integrations',
    description: 'Connect with your favorite tools and services',
    features: [
      'Slack integration',
      'Discord webhooks',
      'Email notifications',
      'Custom webhook support'
    ]
  },
  {
    id: '8',
    title: 'AI-Powered Insights',
    description: 'Machine learning for predictive monitoring',
    features: [
      'Predictive downtime alerts',
      'Performance optimization suggestions',
      'Anomaly detection',
      'Trend analysis'
    ]
  }
];

const Roadmap = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-gray-50 to-gray-100 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
              Product Roadmap
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              See what we're building next. Our roadmap shows the exciting features and improvements coming to exit1.dev.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {roadmapData.map((item) => (
              <div key={item.id} className="border-b border-gray-200 pb-12 last:border-b-0">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {item.title}
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {item.description}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {item.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-base">{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Roadmap; 