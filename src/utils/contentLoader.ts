import heroContent from '../content/hero.json';
import featuresContent from '../content/features.json';
import howItWorksContent from '../content/howItWorks.json';
import headerContent from '../content/header.json';
import footerContent from '../content/footer.json';
import privacyContent from '../content/privacy.json';
import pricingContent from '../content/pricing.json';
import communityContent from '../content/community.json';

export const getHeroContent = () => heroContent;
export const getFeaturesContent = () => featuresContent;
export const getHowItWorksContent = () => howItWorksContent;
export const getHeaderContent = () => headerContent;
export const getFooterContent = () => footerContent;
export const getPrivacyContent = () => privacyContent;
export const getPricingContent = () => pricingContent;
export const getCommunityContent = () => communityContent;

// Type definitions for better TypeScript support
export interface HeroContent {
  title: {
    main: string;
    highlight: string;
  };
  subtitle: string;
  description?: string;
  cta: {
    primary: {
      text: string;
      href: string;
      variant: string;
      size: string;
      className: string;
    };
    secondary: {
      text: string;
      href: string;
      variant: string;
      size: string;
      className: string;
    };
  };
  terminal: {
    title: string;
    commands: Array<{
      command: string;
      response: string | string[];
    }>;
  };
  trustIndicator: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface FeaturesContent {
  title: {
    main: string;
    highlight: string;
  };
  subtitle: string;
  features: Feature[];
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export interface HowItWorksContent {
  title: {
    main: string;
    highlight: string;
  };
  subtitle: string;
  steps: HowItWorksStep[];
  cta: {
    title: string;
    subtitle: string;
    buttons: Array<{
      text: string;
      variant: string;
      className: string;
    }>;
  };
}

export interface NavigationItem {
  name: string;
  href: string;
}

export interface HeaderContent {
  logo: string;
  navigation: NavigationItem[];
  cta: {
    signIn: {
      text: string;
      variant: string;
      size: string;
    };
    startFree: {
      text: string;
      variant: string;
      size: string;
    };
  };
}

export interface SocialItem {
  name: string;
  href: string;
}

export interface FooterContent {
  brand: {
    logo: string;
    description: string;
  };
  navigation: {
    product: NavigationItem[];
    company: NavigationItem[];
    support: NavigationItem[];
    legal: NavigationItem[];
  };
  social: SocialItem[];
  copyright: string;
}

export interface PrivacySubsection {
  title: string;
  description: string;
  items: string[];
}

export interface PrivacySubsectionWithTitle {
  title: string;
  description: string;
}

export interface PrivacyContactInfo {
  email: string;
  discord: {
    text: string;
    url: string;
  };
}

export interface PrivacyContent {
  header: {
    title: string;
    description: string;
    icon: string;
  };
  sections: {
    introduction: {
      title: string;
      content: string;
    };
    informationCollection: {
      title: string;
      icon: string;
      subsections: {
        accountInfo: PrivacySubsection;
        oauthInfo: PrivacySubsection;
        serviceData: PrivacySubsection;
        technicalInfo: PrivacySubsection;
      };
    };
    dataUsage: {
      title: string;
      description: string;
      items: string[];
    };
    dataSharing: {
      title: string;
      description: string;
      items: PrivacySubsectionWithTitle[];
    };
    dataSecurity: {
      title: string;
      icon: string;
      description: string;
      items: string[];
    };
    dataRetention: {
      title: string;
      description: string;
      items: PrivacySubsectionWithTitle[];
    };
    userRights: {
      title: string;
      subsections: {
        accessControl: PrivacySubsection;
        accountDeletion: PrivacySubsection;
      };
    };
    cookies: {
      title: string;
      description: string;
      items: string[];
      additionalInfo: string;
    };
    thirdParty: {
      title: string;
      description: string;
      items: PrivacySubsectionWithTitle[];
      additionalInfo: string;
    };
    childrenPrivacy: {
      title: string;
      content: string;
    };
    internationalTransfers: {
      title: string;
      content: string;
    };
    policyChanges: {
      title: string;
      content: string;
    };
    contact: {
      title: string;
      description: string;
      contactInfo: PrivacyContactInfo;
    };
  };
  navigation: {
    backToHome: string;
  };
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface PricingContent {
  title: {
    main: string;
    highlight: string;
  };
  subtitle: string;
  plans: PricingPlan[];
  enterprise: {
    text: string;
    cta: string;
  };
}

export interface CommunityFeature {
  title: string;
  description: string;
  icon: string;
}

export interface CommunityContent {
  title: string;
  subtitle: string;
  description: string;
  features: CommunityFeature[];
  cta: {
    primary: {
      text: string;
      href: string;
      variant: string;
      size: string;
      className: string;
    };
    secondary: {
      text: string;
      href: string;
      variant: string;
      size: string;
      className: string;
    };
    discord: {
      text: string;
      href: string;
      variant: string;
      size: string;
      className: string;
    };
  };
} 