import { useLoaderStore } from "./stores/loader";

export function initStore(context) {
	const loader = useLoaderStore();

	if (context.store._init != null && typeof context.store._init === 'function') {
		const promise = context.store._init();

		if (promise != null && promise.then != null) {
			loader.pendingPromises++;
			if (loader.pendingPromises > loader.highest) {
				loader.highest = loader.pendingPromises;
			}

			promise.then(() => {
				loader.pendingPromises--;
			});
		}
	}
};