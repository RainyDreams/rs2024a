import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  build: {
    minify: 'esbuild' // 使用 esbuild 进行压缩
  },
  esbuild: {
    minify: true, // 启用代码压缩
    minifyWhitespace: true, // 压缩空白字符
    minifyIdentifiers: true, // 压缩标识符
    minifySyntax: true // 压缩语法
  },
  plugins: [
    vue(),
  ],
});