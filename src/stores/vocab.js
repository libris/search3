import { defineStore } from "pinia";
import { getVocab } from "../lib/http";

export const useVocabStore = defineStore('vocab', {
	state: () => ({
		current: null,
	}),
	getters: {
		context: (state) => state.current != null ? state.current['@context'] : null,
		graph: (state) => state.current != null ? state.current['@graph'] : null,
	},
	actions: {
		async _init() {
			const response = await getVocab();
			this.current = response;
		},
	},
});