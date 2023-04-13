import { useLoaderStore } from "./stores/loader";

export function initStore(context) {
	const loader = useLoaderStore();

	if (context.store._init != null && typeof context.store._init === 'function') {
		const promise = context.store._init();

		if (promise.then != null) {
			loader.pendingPromises++;
			promise.then(() => {
				loader.pendingPromises--;
			});
		}
	}
};