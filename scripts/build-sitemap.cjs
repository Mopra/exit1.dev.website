const fs = require('fs');
const path = require('path');

// Import the sitemap generation functions
const { generateSitemapXml, generateSitemapTxt } = require('./sitemap-generator.cjs');

const publicDir = path.join(process.cwd(), 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate XML sitemap
const xmlContent = generateSitemapXml();
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xmlContent);

// Generate text sitemap
const txtContent = generateSitemapTxt();
fs.writeFileSync(path.join(publicDir, 'sitemap.txt'), txtContent);

console.log('✅ Sitemap files generated successfully'); 