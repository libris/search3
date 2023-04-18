import { RouteRecordRaw } from "vue-router";

// Import routes
import DisplayBooks from '../views/SearchResults/index.vue';
import ProductPage from '../views/ProductPage/index.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Hit list',
		component: DisplayBooks,
	},
	{
		path: '/:fnurgel',
		name: 'Product page',
		component: ProductPage,
	},
];

export default routes;
