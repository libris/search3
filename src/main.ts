import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initStore } from './piniaPlugin';

import App from './App.vue'

const pinia = createPinia();
const app = createApp(App);

pinia.use(initStore);
app.use(pinia);
app.mount('#app')
