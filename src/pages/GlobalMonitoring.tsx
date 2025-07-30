import React from 'react';
import ProductPage from '../components/ProductPage';
import { 
  faGlobe, 
  faMapMarkerAlt, 
  faChartBar, 
  faNetworkWired, 
  faGlobeAmericas, 
  faShieldAlt 
} from '@fortawesome/free-solid-svg-icons';

const GlobalMonitoring = () => {
  const features = [
    {
      title: "Worldwide Coverage",
      description: "Multiple monitoring locations across the globe for comprehensive geographic coverage.",
      icon: faGlobe
    },
    {
      title: "Geographic Analysis",
      description: "Geographic performance analysis with regional insights and location-based monitoring.",
      icon: faMapMarkerAlt
    },
    {
      title: "CDN Monitoring",
      description: "CDN and edge location monitoring to ensure optimal content delivery worldwide.",
      icon: faNetworkWired
    },
    {
      title: "Global Statistics",
      description: "Global uptime statistics with comprehensive performance data from multiple regions.",
      icon: faChartBar
    },
    {
      title: "Regional Insights",
      description: "Regional performance insights to identify and resolve location-specific issues.",
      icon: faGlobeAmericas
    },
    {
      title: "International Compliance",
      description: "International compliance support for global businesses with regional requirements.",
      icon: faShieldAlt
    }
  ];

  return (
    <ProductPage
      title="Global Monitoring"
      subtitle="Worldwide coverage with geographic performance analysis"
      description="Monitor your services from multiple locations worldwide to ensure optimal performance for users everywhere. Get geographic insights and regional performance data."
      features={features}
      ctaText="Start Global Monitoring"
      ctaHref="https://app.exit1.dev/sign-up"
      seoTitle="Global Monitoring - exit1.dev"
      seoDescription="Worldwide monitoring coverage with geographic performance analysis, CDN monitoring, and regional insights. Ensure optimal performance for global users."
    />
  );
};

export default GlobalMonitoring; 