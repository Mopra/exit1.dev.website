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
  faMap,
  faChevronDown,
  faGlobe,
  faClock,
  faCode,
  faChartLine,
  faBell,
  faCertificate,
  faCalendarAlt,
  faEye,
  faChartBar,
  faHistory,
  faRefresh,
  faLink,
  faCog,
  faRocket,
  faTerminal,
  faList,
  faPlay,
  faBug,
  faArrowsAlt,
  faMapMarkerAlt,
  faNetworkWired,
  faGlobeAmericas
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
  faChevronDown,
  faGlobe,
  faClock,
  faCode,
  faChartLine,
  faBell,
  faCertificate,
  faCalendarAlt,
  faEye,
  faChartBar,
  faHistory,
  faRefresh,
  faLink,
  faCog,
  faRocket,
  faTerminal,
  faList,
  faPlay,
  faBug,
  faArrowsAlt,
  faMapMarkerAlt,
  faNetworkWired,
  faGlobeAmericas,
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

// Product pages
const RealTimeMonitoring = React.lazy(() => import('./pages/RealTimeMonitoring'));
const SSLMonitoring = React.lazy(() => import('./pages/SSLMonitoring'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Alerting = React.lazy(() => import('./pages/Alerting'));
const DeveloperConsole = React.lazy(() => import('./pages/DeveloperConsole'));
const GlobalMonitoring = React.lazy(() => import('./pages/GlobalMonitoring'));

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
              
              {/* Product Routes */}
              <Route path="/product/monitoring" element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <RealTimeMonitoring />
                </React.Suspense>
              } />
              <Route path="/product/ssl-monitoring" element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <SSLMonitoring />
                </React.Suspense>
              } />
              <Route path="/product/analytics" element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Analytics />
                </React.Suspense>
              } />
              <Route path="/product/alerting" element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <Alerting />
                </React.Suspense>
              } />
              <Route path="/product/console" element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <DeveloperConsole />
                </React.Suspense>
              } />
              <Route path="/product/global" element={
                <React.Suspense fallback={<LoadingFallback />}>
                  <GlobalMonitoring />
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
