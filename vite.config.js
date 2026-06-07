import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: './',
  base: '/alissia/',
  plugins: [
    // Optimizes all images (SVG, PNG, JPG, WebP, AVIF) when executing 'vite build'
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      exclude: undefined,
      include: undefined,
      includePublic: true,
      logStats: true,
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false, // Keep viewbox for proper SVG scaling
              },
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },
      png: {
        quality: 80, // Compresses png assets cleanly
      },
      jpeg: {
        quality: 80, // Compresses jpeg/jpg assets cleanly
      },
      webp: {
        lossless: true,
      },
    }),
    
    // Copy the backend PHP inc folder into the output 'dist' directory during build
    viteStaticCopy({
      targets: [
        {
          src: 'inc/contact.php',
          dest: 'inc'
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
