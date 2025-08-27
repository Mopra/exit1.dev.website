import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileCheck, 
  Globe, 
  CheckCircle 
} from 'lucide-react';

export const metadata: Metadata = {
  title: "GDPR Compliant Data Privacy | exit1.dev",
  description: "GDPR compliant monitoring with transparent data handling and user control. Your data privacy is our priority with clear policies and complete control over your information. Start using privacy-first monitoring for free.",
  openGraph: {
    title: "GDPR Compliant Data Privacy | exit1.dev",
    description: "GDPR compliant monitoring with transparent data handling and user control. Your data privacy is our priority with clear policies and complete control over your information. Start using privacy-first monitoring for free.",
  },
  twitter: {
    title: "GDPR Compliant Data Privacy | exit1.dev",
    description: "GDPR compliant monitoring with transparent data handling and user control. Your data privacy is our priority with clear policies and complete control over your information. Start using privacy-first monitoring for free.",
  },
};

const DataPrivacy = () => {
  const features = [
    {
      title: "GDPR Compliant",
      description: "Built to meet European data protection standards and regulations.",
      icon: <Shield className="w-6 h-6 text-white" />
    },
    {
      title: "Data Control",
      description: "Full control over your monitoring data and account information.",
      icon: <Lock className="w-6 h-6 text-white" />
    },
    {
      title: "Privacy First",
      description: "Privacy considerations built into every feature from the ground up.",
      icon: <Eye className="w-6 h-6 text-white" />
    },
    {
      title: "Transparent Policies",
      description: "Clear, understandable privacy policies with no hidden fine print.",
      icon: <FileCheck className="w-6 h-6 text-white" />
    },
    {
      title: "Global Standards",
      description: "Meets international privacy standards and best practices.",
      icon: <Globe className="w-6 h-6 text-white" />
    },
    {
      title: "User Rights",
      description: "Easy access to view, export, and manage your personal data.",
      icon: <CheckCircle className="w-6 h-6 text-white" />
    }
  ];

  return (
    <ProductPage
      title="Privacy That Respects You"
      subtitle="GDPR compliant, transparent policies"
      description="Your data privacy matters. We're GDPR compliant with transparent policies, user control, and privacy-first design. Monitor your sites without compromising on privacy."
      features={features}
      ctaText="Monitor With Privacy"
      ctaHref="https://app.exit1.dev/"
      seoTitle="GDPR Compliant Monitoring | exit1.dev"
      seoDescription="Privacy-first monitoring with transparent data policies. Free."
    />
  );
};

export default DataPrivacy;
