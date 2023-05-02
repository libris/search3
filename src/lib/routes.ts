import { RouteRecordRaw } from "vue-router";

// Import routes
import LandingPage from '@/views/LandingPage/index.vue';
import DisplayBooks from '@/views/SearchResults/index.vue';
import ProductPage from "@/views/ProductPage/index.vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: LandingPage,
	},
	{
		path: '/find',
		component: DisplayBooks,
	},
	{
		path: '/:fnurgel',
		component: ProductPage,
	},
];

export default routes;
