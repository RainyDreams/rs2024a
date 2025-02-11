import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer';
import viteCDNImport from 'vite-plugin-cdn-import';
export default defineConfig((mode) => {
  return {
    server: {
      allowedHosts: ['aaa.chiziingiin.top']
    },
    // base:'./',
    plugins: [
      vue(),
      legacy({
        targets: ['>0.3%, edge>=79, firefox>=67, chrome>=64, safari>=12, chromeAndroid>=64, iOS>=12'],
      }),
      visualizer({
        emitFile: false,
        file: "stats.html", //分析图生成的文件名
        open:true //如果存在本地服务端口，将在打包后自动展示
      }),
      viteCDNImport({
        modules: [
          {
            name: 'highlight.js',
            var: 'hljs',
            path: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js',
            css: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/default.min.css'
          },
          {
            name: 'katex',
            var: 'Katex',
            path: 'https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js',
            css: 'https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css'
          }
        ]
      })
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.split('node_modules/')[1].split('/')[0];
              return btoa(id.toString().split('node_modules/')[1].split('/')[0].toString()).slice(0,5);
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
  };
});
