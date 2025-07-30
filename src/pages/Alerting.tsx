import React from 'react';
import ProductPage from '../components/ProductPage';
import { 
  faBell, 
  faLink, 
  faShieldAlt, 
  faCog, 
  faCheck, 
  faRocket 
} from '@fortawesome/free-solid-svg-icons';

const Alerting = () => {
  const features = [
    {
      title: "Webhook Integration",
      description: "Custom webhook endpoints for instant notifications with configurable event triggers.",
      icon: faLink
    },
    {
      title: "Real-Time Alerts",
      description: "Instant status change alerts, SSL certificate expiration warnings, and performance notifications.",
      icon: faBell
    },
    {
      title: "Secure Delivery",
      description: "Webhook signature verification for security with custom headers and authentication support.",
      icon: faShieldAlt
    },
    {
      title: "Customizable Notifications",
      description: "Configurable notification preferences with multiple webhook endpoints per user.",
      icon: faCog
    },
    {
      title: "Testing & Validation",
      description: "Webhook testing and validation tools to ensure reliable notification delivery.",
      icon: faCheck
    },
    {
      title: "Cross-Platform Support",
      description: "Support for multiple notification channels including Slack, Discord, email, and custom integrations.",
      icon: faRocket
    }
  ];

  return (
    <ProductPage
      title="Smart Alerting & Notifications"
      subtitle="Webhook integration and real-time notifications"
      description="Never miss a critical event with instant notifications via webhooks, custom integrations, and real-time alerts. Configure exactly how and when you want to be notified."
      features={features}
      ctaText="Set Up Alerts"
      ctaHref="https://app.exit1.dev/sign-up"
      seoTitle="Smart Alerting & Notifications - exit1.dev"
      seoDescription="Webhook integration and real-time notifications with instant alerts, SSL certificate warnings, and customizable notification preferences."
    />
  );
};

export default Alerting; 