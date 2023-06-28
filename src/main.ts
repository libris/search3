import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initStore } from './piniaPlugin';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createVfm } from 'vue-final-modal';
import piniaResist from 'pinia-plugin-persist';
import 'vue-final-modal/style.css'
import router from '@/lib/router';
import './lib/icons';
import App from './App.vue';

import Button from './components/Button.vue';
import Card from './components/Card.vue';

const vfm = createVfm();
const pinia = createPinia();
const app = createApp(App);

pinia.use(initStore);
pinia.use(piniaResist);

app.use(pinia);
app.use(router);
app.use(vfm);

app.component('Button', Button);
app.component('Card', Card);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
