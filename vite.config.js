import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import legacy from '@vitejs/plugin-legacy'

export default defineConfig((mode) => {
  return {
    plugins: [
      vue(),
      legacy({
        targets: ['>0.3%, edge>=79, firefox>=67, chrome>=64, safari>=12, chromeAndroid>=64, iOS>=12'],
      })
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
          drop_console: false,
          drop_debugger: true,
          passes: 10,
        },
        format: {
          comments: false,
        }
      },
      chunkSizeWarningLimit: 500, 
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'element-plus'],
    },
  };
});
