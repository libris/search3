import { defineStore } from "pinia";

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
			const data = await fetch('/vocab.jsonld').then((response) =>
				response.json()
			);

			this.current = data;
		},
	},
});