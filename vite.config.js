import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import legacy from '@vitejs/plugin-legacy'
export default defineConfig((mode) => {
  return {
    server: {
      allowedHosts: ['aaa.chiziingiin.top'],
      proxy: {
        '/api/': {
          target: 'https://lingben.top',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/'),
          secure: false,
        },
      }
    },
    // base:'./',
    plugins: [
      vue(),
      // legacy({
      //   targets: ['>0.3%, edge>=79, firefox>=67, chrome>=64, safari>=12, chromeAndroid>=64, iOS>=12'],
      // }),
    ],
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const { name } = assetInfo;
            if (/\.(css|scss|less|sass)$/.test(name)) {
              return 'assets/[name]-[hash].[ext]';
            }
            return 'assets/[name]-[hash].[ext]';
          },
          manualChunks(id) {
            if (id.includes('.vue')) {
              console.log(id);
              const match = id.match(/src\/views\/(.*)\/[^/]+\.vue$/);
              if (match) {
                return `${match[1].replace(/\//g, '-')}`;
              }
            }
            if (id.includes('node_modules')) {
              return 'vendor';
              // return id.split('node_modules/')[1].split('/')[0];
              // return btoa(id.toString().split('node_modules/')[1].split('/')[0].toString());
            }
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          // drop_debugger: false,
          passes: 10,
          unused: true
        },
        format: {
          beautify: false,
          comments: false,
        },
      },
      chunkSizeWarningLimit: 500, 
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'element-plus'],
    },
  }
})
