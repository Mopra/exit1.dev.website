import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faSearch, 
  faTimes, 
  faArrowRight, 
  faCheck, 
  faExclamationTriangle,
  faHome,
  faBlog,
  faShieldAlt,
  faMap
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import SEO from './components/SEO';
import ErrorBoundary from './components/ErrorBoundary';
import SkipLink from './components/SkipLink';

// Configure FontAwesome library
library.add(
  faSearch, 
  faTimes, 
  faArrowRight, 
  faCheck, 
  faExclamationTriangle,
  faHome,
  faBlog,
  faShieldAlt,
  faMap,
  faGithub,
  faTwitter
);

// Lazy load non-critical components with better chunking
const HomeContent = React.lazy(() => import('./components/HomeContent'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPost'));
const Roadmap = React.lazy(() => import('./pages/Roadmap'));
const Sitemap = React.lazy(() => import('./pages/Sitemap'));

// Optimized loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-32">
    <div className="text-gray-500">Loading...</div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
          <SkipLink />
          <SEO />
          <Header />
          <main id="main-content">
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <React.Suspense fallback={<LoadingFallback />}>
                    <HomeContent />
                  </React.Suspense>
                </>
              } />
              <Route path="/blog" element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Blog />
                </React.Suspense>
              } />
              <Route path="/blog/:slug" element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <BlogPostPage />
                </React.Suspense>
              } />
              <Route path="/privacy" element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Privacy />
                </React.Suspense>
              } />
              <Route path="/roadmap" element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Roadmap />
                </React.Suspense>
              } />
              <Route path="/sitemap" element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Sitemap />
                </React.Suspense>
              } />
            </Routes>
          </main>
          <Footer />
          <CookieConsent />
        </div>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
