import { defineStore } from "pinia";
import { getVocab } from "../lib/data";

export const useVocabStore = defineStore('vocab', {
	state: () => ({
		current: null,
		map: null,
	}),
	getters: {
		context: (state) => state.current != null ? state.current['@context'] : null,
		graph: (state) => state.current != null ? state.current['@graph'] : null,
	},
	actions: {
		async _init() {
			const response = await getVocab();
			this.current = response;
			this.map = new Map(response['@graph'].map(entry => [entry['@id'], entry]));
		},
	},
});