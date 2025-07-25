import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

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
  base: '/exit1.dev.website/',
  plugins: [react(), markdownPlugin()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
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
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          cookie: ['js-cookie'],
          matter: ['gray-matter'],
          markdown: ['remark', 'remark-html', 'remark-gfm'],
        },
        entryFileNames: '[name].[hash:8].js',
        chunkFileNames: '[name].[hash:8].js',
        assetFileNames: '[name].[hash:8].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'buffer'],
    exclude: ['@vitejs/plugin-react-swc'],
  },
});
