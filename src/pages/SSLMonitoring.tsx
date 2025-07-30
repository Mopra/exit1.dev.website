import React from 'react';
import ProductPage from '../components/ProductPage';
import { 
  faCertificate, 
  faCalendarAlt, 
  faEye, 
  faExclamationTriangle, 
  faShieldAlt, 
  faClock 
} from '@fortawesome/free-solid-svg-icons';

const SSLMonitoring = () => {
  const features = [
    {
      title: "Automatic SSL Validation",
      description: "Automatic SSL certificate validation for HTTPS URLs with comprehensive certificate analysis.",
      icon: faCertificate
    },
    {
      title: "Expiration Tracking",
      description: "Certificate expiration tracking with countdown timers and proactive warning notifications.",
      icon: faCalendarAlt
    },
    {
      title: "Certificate Details",
      description: "View issuer and subject information with detailed certificate metadata and validity dates.",
      icon: faEye
    },
    {
      title: "Visual Status Indicators",
      description: "Clear visual status indicators showing valid, expiring, and invalid certificate states.",
      icon: faExclamationTriangle
    },
    {
      title: "Proactive Warnings",
      description: "Get early warnings before certificates expire to prevent service disruptions.",
      icon: faShieldAlt
    },
    {
      title: "Real-Time Monitoring",
      description: "Continuous monitoring with real-time updates on certificate status changes.",
      icon: faClock
    }
  ];

  return (
    <ProductPage
      title="SSL Certificate Monitoring"
      subtitle="Advanced SSL certificate validation and expiration tracking"
      description="Never let an SSL certificate expire again. Get automatic validation, expiration tracking, and proactive warnings to keep your HTTPS services secure and accessible."
      features={features}
      ctaText="Start SSL Monitoring"
              ctaHref="https://app.exit1.dev/"
      seoTitle="SSL Certificate Monitoring - exit1.dev"
      seoDescription="Advanced SSL certificate validation and expiration tracking with automatic monitoring and proactive warnings. Keep your HTTPS services secure."
    />
  );
};

export default SSLMonitoring; 