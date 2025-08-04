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
      title="Free SSL Uptime Monitor - Certificate Monitoring"
      subtitle="Free SSL certificate monitoring included with our uptime monitor service"
      description="Never let an SSL certificate expire again with our free uptime monitor. Get automatic SSL validation, expiration tracking, and proactive warnings included in your free uptime monitoring service. Complete website monitoring solution."
      features={features}
      ctaText="Start Free SSL Monitoring"
              ctaHref="https://app.exit1.dev/"
      seoTitle="Free SSL Certificate Monitoring - Uptime Monitor | exit1.dev"
      seoDescription="Free SSL certificate monitoring included with our uptime monitor service. Automatic SSL validation, expiration tracking, and proactive warnings. Part of the best free uptime monitor."
    />
  );
};

export default SSLMonitoring; 