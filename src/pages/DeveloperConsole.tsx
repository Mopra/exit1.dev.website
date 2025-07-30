import React from 'react';
import ProductPage from '../components/ProductPage';
import { 
  faTerminal, 
  faList, 
  faPlay, 
  faCog, 
  faBug, 
  faArrowsAlt 
} from '@fortawesome/free-solid-svg-icons';

const DeveloperConsole = () => {
  const features = [
    {
      title: "Interactive CLI",
      description: "Interactive command-line interface for advanced monitoring management and system control.",
      icon: faTerminal
    },
    {
      title: "Real-Time Logs",
      description: "Real-time system logs and monitoring with live updates and comprehensive debugging information.",
      icon: faList
    },
    {
      title: "Check Management",
      description: "Manage checks via console commands with manual triggering and immediate status updates.",
      icon: faPlay
    },
    {
      title: "System Metrics",
      description: "System status and performance metrics with detailed monitoring infrastructure insights.",
      icon: faCog
    },
    {
      title: "Debug Tools",
      description: "Advanced debugging tools and troubleshooting utilities for complex monitoring scenarios.",
      icon: faBug
    },
    {
      title: "Resizable Interface",
      description: "Resizable and draggable console window for optimal developer experience and workflow.",
      icon: faArrowsAlt
    }
  ];

  return (
    <ProductPage
      title="Developer Console"
      subtitle="Interactive CLI for advanced management and debugging"
      description="Take full control of your monitoring setup with our powerful developer console. Manage checks, view real-time logs, and debug issues with advanced CLI tools designed for developers."
      features={features}
      ctaText="Access Console"
      ctaHref="https://app.exit1.dev/sign-up"
      seoTitle="Developer Console - exit1.dev"
      seoDescription="Interactive command-line interface for advanced monitoring management, real-time logs, and debugging tools. Built for developers who need full control."
    />
  );
};

export default DeveloperConsole; 