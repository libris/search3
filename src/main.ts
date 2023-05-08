import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initStore } from './piniaPlugin';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createVfm } from 'vue-final-modal';
import router from '@/lib/router';
import './lib/icons';
import App from './App.vue';

const vfm = createVfm();
const pinia = createPinia();
const app = createApp(App);

pinia.use(initStore);
app.use(pinia);
app.use(router);
app.use(vfm);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
