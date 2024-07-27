import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from './routers/index'
import App from './App.vue'
import './styles/index.scss'
// import 'element-plus/dist/index.css'
import ECharts from 'vue-echarts';
import * as echarts from 'echarts';
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers';
const app = createApp(App);
app.use(router)
app.config.globalProperties.$echarts = echarts;
echarts.use([SVGRenderer]);
app.use(ElementPlus)
app.component('v-chart', ECharts);
app.mount('#app')
