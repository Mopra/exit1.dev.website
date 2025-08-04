import React from 'react';
import ProductPage from '../components/ProductPage';
import { 
  faGlobe, 
  faClock, 
  faCode, 
  faShieldAlt, 
  faChartLine, 
  faBell 
} from '@fortawesome/free-solid-svg-icons';

const RealTimeMonitoring = () => {
  const features = [
    {
      title: "Unlimited Free Uptime Monitoring",
      description: "Free uptime monitor for unlimited websites and REST API endpoints with 1-minute uptime monitoring intervals.",
      icon: faGlobe
    },
    {
      title: "Real-Time Uptime Updates",
      description: "Get instant uptime status updates with real-time notifications when your services go down or come back up.",
      icon: faClock
    },
    {
      title: "HTTP Method Support",
      description: "Support for all HTTP methods including GET, POST, PUT, PATCH, DELETE, and HEAD requests.",
      icon: faCode
    },
    {
      title: "Custom Headers & Auth",
      description: "Configure custom request headers and authentication for secure API monitoring.",
      icon: faShieldAlt
    },
    {
      title: "Response Validation",
      description: "Validate response bodies with JSONPath support and expected status code validation.",
      icon: faChartLine
    },
    {
      title: "Instant Alerts",
      description: "Receive immediate notifications via webhooks, email, and other channels when issues are detected.",
      icon: faBell
    }
  ];

  return (
    <ProductPage
      title="Free Uptime Monitor - Real-Time Website Monitoring"
      subtitle="Best free uptime monitor for unlimited websites and APIs with instant uptime alerts"
      description="Professional free uptime monitor with real-time visibility into your infrastructure. Get 1-minute uptime monitoring intervals, custom authentication, and comprehensive response validation. The most reliable free uptime monitor available."
      features={features}
      ctaText="Start Free Uptime Monitoring"
              ctaHref="https://app.exit1.dev/"
      seoTitle="Free Uptime Monitor - Real-Time Website Monitoring | exit1.dev"
      seoDescription="Best free uptime monitor for unlimited websites and APIs. Real-time uptime monitoring with 1-minute checks, custom authentication, and instant downtime alerts. Start monitoring for free."
    />
  );
};

export default RealTimeMonitoring; 