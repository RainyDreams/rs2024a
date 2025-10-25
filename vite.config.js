import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import legacy from '@vitejs/plugin-legacy'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig((mode) => {
  return {
    server: {
      allowedHosts: ['aaa.chiziingiin.top','remote.lingben.top'],
      proxy: {
        '/api/': {
          target: 'https://lingben.top',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/'),
          secure: false,
        },
      },
      cors: true,
      // 配置 HMR 连接地址（关键）
      // port: 80,
      // hmr: {
      //   // 若前端通过 remote.lingben.top 访问，指定 WebSocket 连接的域名/端口
      //   host: 'remote.lingben.top', // 与前端访问的域名一致
      //   // port: 443, // 若使用 HTTPS，默认端口是 443；若为 HTTP 则可能是 80
      //   // 可选：强制使用 wss:// 协议（如果前端是 HTTPS）
      //   protocol: 'wss', // 或 'ws'（根据前端协议选择）
      // },
    },
    // base:'./',
    plugins: [
      vue(),
      tailwindcss(),
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
