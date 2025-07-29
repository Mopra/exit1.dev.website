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
  title = 'Exit1.dev - Professional Website Monitoring',
  description = 'Monitor your website uptime, performance, and get instant alerts when issues occur. Professional website monitoring service.',
  canonical,
  image = '/screenshots/screenshot-1.png',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Exit1.dev'
}: SEOProps) => {
  const fullTitle = title === 'Exit1.dev - Professional Website Monitoring' 
    ? title 
    : `${title} | Exit1.dev`;

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
    </Helmet>
  );
};

export default SEO; 