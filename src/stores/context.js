import { defineStore } from "pinia";
import { getContext } from "../lib/data";

export const useContextStore = defineStore('context', {
	state: () => ({
		current: null,
	}),
	getters: {
		context: (state) => state.current != null ? state.current['@context'] : null,
		graph: (state) => state.current != null ? state.current['@graph'] : null,
	},
	actions: {
		async _init() {
			const response = await getContext();
			this.current = response;
		},
	},
});