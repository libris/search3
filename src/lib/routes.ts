import { RouteRecordRaw } from "vue-router";

// Import routes
import DisplayBooks from '../views/SearchResults/index.vue';
import WorkPage from '../views/WorkPage/index.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: DisplayBooks,
	},
	{
		path: '/:fnurgel',
		component: WorkPage,
	},
];

export default routes;
