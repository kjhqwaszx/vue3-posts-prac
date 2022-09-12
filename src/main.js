import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from '@/router';
import dayjs from '@/plugins/dayjs';
import focus from '@/directives/focus';

const app = createApp(App);
const pinia = createPinia();
app.directive('focus', focus);

app.use(router);
app.use(pinia);
app.use(dayjs);
app.mount('#app');

import 'bootstrap/dist/js/bootstrap.js';
