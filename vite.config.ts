import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { generateSitemapFiles } from './src/utils/sitemapServer';

// Custom plugin to handle markdown files
const markdownPlugin = () => {
  return {
    name: 'markdown-loader',
    transform(code: string, id: string) {
      if (id.endsWith('.md')) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null
        };
      }
    }
  };
};

// Custom plugin to generate sitemap
const sitemapPlugin = () => {
  return {
    name: 'sitemap-generator',
    async closeBundle() {
      await generateSitemapFiles();
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), markdownPlugin(), sitemapPlugin()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
});
