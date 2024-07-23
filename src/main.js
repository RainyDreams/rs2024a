import { createApp } from 'vue'
import router from './routers/index'
import App from './App.vue'
import './styles/index.scss'
import ECharts from 'vue-echarts';
import * as echarts from 'echarts';
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers';
const app = createApp(App);
app.use(router)
app.config.globalProperties.$echarts = echarts;
echarts.use([SVGRenderer]);
app.component('v-chart', ECharts);
app.mount('#app')
