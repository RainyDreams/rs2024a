import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import compression from 'vite-plugin-compression';
import purgecss from 'vite-plugin-purgecss';

export default defineConfig({
  plugins: [
    vue(),
    // purgecss({
    //   content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,sass,scss}'],
    //   safelist: ['important-class', /^another-important-class/],
    // }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router'],
  },
});
