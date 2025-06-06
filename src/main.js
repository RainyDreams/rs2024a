import { createApp } from 'vue';
import router from './routers/index';
import App from './App.vue';
import longPress from './utils/v-long-press';
import './styles/index.scss';
import './styles/animate.css';
import './styles/tw.css'
import 'nprogress/nprogress.css';
import 'swiper/css';
const app = createApp(App);
app.directive('long-press', longPress);
app.use(router);
app.mount('#app')
