import { defineStore } from "pinia";
import router from '@/lib/router';
import { getQueryParams } from "@/lib/http";

export const useQueryStore = defineStore('query', {
	state: () => {
		const queryParams = getQueryParams();

		return {
			facets: [],
			q: '',
			'_limit': 20,
			'_sort': '',
			'@type': 'Text',
			...queryParams,
		};
	},
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
	actions: {
		redirect() {
			if (window.location.pathname == '/find') {
				router.replace({ path: '/find', query: this.query });
			} else {
				router.push({ path: '/find', query: this.query });
			}
		},
	},
});