import React from 'react';
import ScreenshotGallery from './ScreenshotGallery';
import Features from './Features';
import Pricing from './Pricing';
import Community from './Community';

const HomeContent = () => {
  return (
    <>
      <ScreenshotGallery />
      <Features />
      <Pricing />
      <Community />
    </>
  );
};

export default HomeContent; 