import { defineStore } from "pinia";
import { getChip, getItemSummary, getItemLabel } from "@/lxljs/display";
import { getResources } from "@/lib/resources";
import settings from "@/lib/settings";
import { getRelatedRecords } from '@/lib/http';
import { useQueryStore } from "@/stores/query";

export const useSearchResults = defineStore('searchResults', {
	state: () => ({
		current: null,
		stats: null,

		Instance: [],
		Print: [],
		Text: [],
	}),
	getters: {
		context: (state) => state.current != null ? state.current['@context'] : null,
		graph: (state) => state.current != null ? state.current['@graph'] : null,
		indexedData: (state) => {
			let result = [];
			Object.keys(state).forEach((stateKey) => {
				if (stateKey === 'graph' || stateKey === 'current' || stateKey === 'context') {
					return false;
				}

				if (Array.isArray(state[stateKey])) {
					result = [...result, ...state[stateKey]];
				}
			});

			return result;
		},
		booksFromQuery: (state) => {
			return [...state.Text];
		},
	},
	actions: {
		async query() {
			const query = useQueryStore().query;

			console.log('run query......', query);

			const response = await getRelatedRecords(query, settings.apiPath);

			this.$reset();

			this.current = response.items;
			this.stats = response.stats;
			this.indexData();
		},

		indexData() {
			if (this.current == null) {
				return false;
			}

			const stateKeys = Object.keys(this.$state);

			this.current.forEach((item) => {
				if (stateKeys.indexOf(item['@type']) > -1 && Array.isArray(this.$state[item['@type']])) {
					if (getResources().context != null) {
						const chip = getChip(item, getResources(), [], settings);
						const summary = getItemSummary(
							item,
							getResources(),
							[],
							settings,
							getResources().displayGroups,
						);

						this.$state[item['@type']].push({
							...item,
							...summary,
							...chip,
						});
					}
				}
			});

			stateKeys.forEach((key) => {
				if (key === 'Text') {
					this.$state[key] = this.$state[key].map(this.calculateDisplayMeta);
				}
			});
		},

		calculateDisplayMeta(item) {
			const clone = JSON.parse(JSON.stringify(item));

			if (item['@type'] === 'Text') {
				clone.title = getItemLabel(item.hasTitle[0], getResources(), [], settings);
			}

			return clone;
		},

	},
});