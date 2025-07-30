import React from 'react';
import ProductPage from '../components/ProductPage';
import { 
  faChartBar, 
  faClock, 
  faChartLine, 
  faEye, 
  faHistory, 
  faRefresh 
} from '@fortawesome/free-solid-svg-icons';

const Analytics = () => {
  const features = [
    {
      title: "Performance Dashboard",
      description: "24-hour performance charts with response time trends and comprehensive uptime statistics.",
      icon: faChartBar
    },
    {
      title: "Real-Time Updates",
      description: "Live data updates without page refresh for instant visibility into your infrastructure.",
      icon: faClock
    },
    {
      title: "Response Time Analysis",
      description: "Track average, minimum, and maximum response times with performance degradation alerts.",
      icon: faChartLine
    },
    {
      title: "Interactive Pulse Monitor",
      description: "Hourly status visualization with downtime incident tracking and frequency analysis.",
      icon: faEye
    },
    {
      title: "Historical Data",
      description: "Historical data aggregation and trend analysis with custom time range analysis (24h, 7d, 30d).",
      icon: faHistory
    },
    {
      title: "Status Distribution",
      description: "Status code distribution and error pattern recognition for comprehensive monitoring insights.",
      icon: faRefresh
    }
  ];

  return (
    <ProductPage
      title="Analytics & Reporting"
      subtitle="Comprehensive statistics dashboard and performance insights"
      description="Get deep insights into your infrastructure performance with real-time analytics, historical trends, and comprehensive reporting. Make data-driven decisions to optimize your services."
      features={features}
      ctaText="View Analytics"
      ctaHref="https://app.exit1.dev/sign-up"
      seoTitle="Analytics & Reporting - exit1.dev"
      seoDescription="Comprehensive statistics dashboard with real-time performance analytics, historical trends, and detailed reporting. Get insights into your infrastructure performance."
    />
  );
};

export default Analytics; 