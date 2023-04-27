import { defineStore } from "pinia";

export const useQueryStore = defineStore('query', {
	state: () => ({
		facets: [],
		q: '',
		'_limit': 20,
		'_sort': '',
		'@type': 'Text',
	}),
	getters: {
		query: (state) => {
			let facets = {};
			state.facets.forEach((facet) => {
				let split = facet.split('=');
				facets[split[0]] = split[1];
			});

			return {
				'q': state['q'] != '' ? state['q'] : '*',
				'_limit': state['_limit'],
				'_sort': state['_sort'],
				'@type': state['@type'],
				...facets,
			};
		},
	},
});