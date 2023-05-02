import routes from "./routes";
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.VITE_VUE_APP_BASE_URL || '/'),
	routes,
});

export default router;