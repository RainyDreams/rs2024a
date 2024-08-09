import { createApp } from 'vue';
import router from './routers/index';
import App from './App.vue';
import './styles/index.scss';
import 'animate.css';
import './styles/tw.css'
const app = createApp(App);
app.use(router);
app.mount('#app')
