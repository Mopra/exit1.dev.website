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
      title: "Unlimited Monitoring",
      description: "Monitor unlimited websites and REST API endpoints with configurable check intervals from 1-5 minutes.",
      icon: faGlobe
    },
    {
      title: "Real-Time Updates",
      description: "Get instant status updates with real-time notifications when your services go down or come back up.",
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
      title="Real-Time Website & API Monitoring"
      subtitle="Monitor unlimited websites and APIs with instant notifications"
      description="Get real-time visibility into your infrastructure with configurable monitoring intervals, custom authentication, and comprehensive response validation. Never miss a downtime event again."
      features={features}
      ctaText="Start Monitoring Free"
              ctaHref="https://app.exit1.dev/"
      seoTitle="Real-Time Website & API Monitoring - exit1.dev"
      seoDescription="Monitor unlimited websites and APIs with real-time status updates, custom authentication, and instant notifications. Start monitoring for free today."
    />
  );
};

export default RealTimeMonitoring; 