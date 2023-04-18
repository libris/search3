import { defineStore } from "pinia";

export const useLoaderStore = defineStore('loader', {
	state: () => ({
		pendingPromises: 0,
		highest: 0,
	}),
	getters: {
		isLoading: (state) => state.pendingPromises > 0 || state.highest == 0,
	},
});