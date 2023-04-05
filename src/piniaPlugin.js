export function initStore(context) {
	if (context.store._init != null && typeof context.store._init === 'function') {
		context.store._init();
	}
};