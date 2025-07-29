import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

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

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Base path for static hosting
  plugins: [react(), markdownPlugin()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    hmr: {
      overlay: false,
    },
  },
  build: {
    target: 'es2022',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React core for better caching
          'react-core': ['react', 'react-dom'],
          // Router in separate chunk
          router: ['react-router-dom'],
          // Cookie utilities
          cookie: ['js-cookie'],
          // Markdown processing
          matter: ['gray-matter'],
          markdown: ['remark', 'remark-html', 'remark-gfm'],
          // UI components (non-critical)
          ui: ['react-helmet-async'],
        },
        // Optimize file names for better caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return 'assets/[name].[hash].css';
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return 'assets/images/[name].[hash].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Reduce bundle size
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'buffer'],
    exclude: ['@vitejs/plugin-react-swc'],
  },
  // SSG specific configuration
  ssr: {
    noExternal: ['react-router-dom']
  }
});
