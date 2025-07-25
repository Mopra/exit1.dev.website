#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the sitemap generator functions
const { generateSitemapXml, generateSitemapTxt } = await import('../src/utils/sitemapGenerator.ts');

const generateSitemapFiles = () => {
  const publicDir = path.join(process.cwd(), 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    // Generate XML sitemap
    const xmlContent = generateSitemapXml();
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xmlContent);
    console.log('✅ XML sitemap generated: public/sitemap.xml');

    // Generate text sitemap
    const txtContent = generateSitemapTxt();
    fs.writeFileSync(path.join(publicDir, 'sitemap.txt'), txtContent);
    console.log('✅ Text sitemap generated: public/sitemap.txt');

    console.log('🎉 All sitemap files generated successfully!');
  } catch (error) {
    console.error('❌ Error generating sitemap files:', error);
    process.exit(1);
  }
};

// Run if called directly
generateSitemapFiles(); 