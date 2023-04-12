import { RouteRecordRaw } from "vue-router";

// Import routes
import DisplayBooks from '../views/DisplayBooks.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: DisplayBooks,
	},
];

export default routes;
