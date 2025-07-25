import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoDemo from './components/VideoDemo';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Community from './components/Community';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import Privacy from './pages/Privacy';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPost';
import Roadmap from './pages/Roadmap';
import Sitemap from './pages/Sitemap';

const Home = () => {
  return (
    <main className="relative">
      <Hero />
      <VideoDemo />
      <Features />
      <HowItWorks />
      <Pricing />
      <Community />
    </main>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/sitemap" element={<Sitemap />} />
      </Routes>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default App;
