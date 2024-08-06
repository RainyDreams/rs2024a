import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig((mode) => {
  return {
    plugins: [
      vue(),
    ],
    // build: (mode === 'production') ? {
    //   rollupOptions: {
    //     output: {
    //       manualChunks(id) {
    //         if (id.includes('node_modules')) {
    //           return id.toString().split('node_modules/')[1].split('/')[0].toString();
    //         }
    //       },
    //     },
    //   },
    //   minify: 'terser',
    //   terserOptions: {
    //     compress: {
    //       drop_debugger: true,
    //     },
    //   },
    // } : {},
    // optimizeDeps: {
    //   include: ['vue', 'vue-router'],
    // },
  };
});
