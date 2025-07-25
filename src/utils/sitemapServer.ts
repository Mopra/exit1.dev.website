import { generateSitemapXml, generateSitemapTxt } from './sitemapGenerator';

// For development server
export const setupSitemapRoutes = (app: any) => {
  // XML Sitemap route
  app.get('/sitemap.xml', (_req: any, res: any) => {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(generateSitemapXml());
  });

  // Text Sitemap route
  app.get('/sitemap.txt', (_req: any, res: any) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(generateSitemapTxt());
  });
};

// For production build - generate static files
export const generateSitemapFiles = async () => {
  const fs = await import('fs');
  const path = await import('path');

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
}; 