import React from 'react';
import ScreenshotGallery from './ScreenshotGallery';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Pricing from './Pricing';
import CliDownload from './CliDownload';
import Community from './Community';

const HomeContent = () => {
  return (
    <>
      <ScreenshotGallery />
      <Features />
      <HowItWorks />
      <Pricing />
      <CliDownload />
      <Community />
    </>
  );
};

export default HomeContent; 