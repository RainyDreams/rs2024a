import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig((mode) => {
  return {
    plugins: [
      vue(),
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
          passes: 10,
          keep_fnames: false, 
        },
        mangle: {
          toplevel: true, // 顶层作用域混淆
          properties: {
            regex: /^_/
          }
        },
        format: {
          comments: false // 去除注释
        }
      },
      chunkSizeWarningLimit: 500, 
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'element-plus'],
    },
  };
});
