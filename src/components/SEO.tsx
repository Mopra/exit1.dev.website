import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

const SEO = ({ 
  title = 'Free Uptime Monitor - Unlimited Website Monitoring | exit1.dev',
  description = 'Free uptime monitor with unlimited website monitoring, 1-minute checks, SSL tracking & instant alerts. No credit card required. Best free website monitoring service for developers.',
  canonical,
  image = '/screenshots/screenshot-1.png',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Exit1.dev'
}: SEOProps) => {
  const fullTitle = title === 'Free Uptime Monitor - Unlimited Website Monitoring | exit1.dev' 
    ? title 
    : `${title} | exit1.dev`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Exit1.dev" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific meta */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Keywords for better ranking */}
      <meta name="keywords" content="free uptime monitor, website monitoring, uptime monitoring, free website monitor, website uptime checker, site monitoring, server monitoring, uptime tracking, downtime alerts, SSL monitoring" />
      
      {/* Structured Data for Software Service */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "exit1.dev Free Uptime Monitor",
          "description": "Free uptime monitor with unlimited website monitoring, 1-minute checks, SSL tracking & instant alerts. No credit card required.",
          "url": "https://exit1.dev",
          "applicationCategory": "NetworkApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
          },
          "featureList": [
            "Free unlimited website monitoring",
            "1-minute uptime checks",
            "SSL certificate monitoring", 
            "Instant downtime alerts",
            "Webhook integrations",
            "No credit card required"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 