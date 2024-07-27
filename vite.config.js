import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import ElementPlus from 'unplugin-element-plus/vite'

// import { ElementPl
// usResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: {
  //     '~/': `${path.resolve(__dirname, 'src')}/`,
  //   },
  // },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@use "~/styles/index.scss" as *;`,
  //     },
  //   },
  // },
  plugins: [
    vue(),
    // Components({
    //   resolvers: [
    //     ElementPlusResolver({
    //       importStyle: "sass",
    //       // directives: true,
    //       // version: "2.1.5",
    //     }),
    //   ],
    // }),
    // ElementPlus({
    //   useSource: true,
    // }),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()],
    // }),
  ],
})