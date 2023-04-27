import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initStore } from './piniaPlugin';
import { createRouter, createWebHistory } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import routes from './lib/routes';
import './lib/icons';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);
const router = createRouter({
	history: createWebHistory(),
	routes,
});

pinia.use(initStore);
app.use(pinia);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
