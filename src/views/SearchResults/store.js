import { defineStore } from "pinia";
import { getChip, getItemSummary, getItemLabel } from "@/lxljs/display";
import { getResources } from "@/lib/resources";
import { splitJson } from "@/lxljs/data";
import { getAtPath } from "@/lib/item";
import settings from "@/lib/settings";
import { getQueryParams, getRelatedRecords, getDocument } from '@/lib/http';

export const useSearchResults = defineStore('searchResults', {
	state: () => ({
		current: null,
		stats: null,
		search: null,

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
		async query(queryString) {
			const query = getQueryParams(queryString);
			const response = await getRelatedRecords(query, settings.apiPath);

			this.$reset();

			this.current = response.items;
			this.stats = response.stats;
			this.search = response.search;
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
					const promises = this.$state[key].map(this.calculateFetchedMeta);

					Promise.all(promises).then((results) => {
						this.$state[key] = results;
					});
				}
			});
		},

		calculateDisplayMeta(item) {
			const clone = JSON.parse(JSON.stringify(item));

			if (item['@type'] === 'Text') {
				clone.title = getItemLabel(item.hasTitle[0], getResources(), [], settings);
				if (clone.genreForm != null && Array.isArray(clone.genreForm)) {
					clone.genreFormCalculated = clone.genreForm.map((genre) => {
						return getItemLabel(genre, getResources(), [], settings);
					});
				}
			}

			return clone;
		},

		async calculateFetchedMeta(item) {
			const clone = JSON.parse(JSON.stringify(item));
			const response = await getDocument(`${clone['@id']}/data.jsonld`);
			const split = splitJson(response.data);

			if (item['@type'] === 'Text') {
				if (clone['@reverse'].hasOwnProperty('instanceOf')) {
					clone.instanceIds = clone['@reverse']['instanceOf'].map((instance) => instance['@id']);
					if (clone.instanceIds != null) {
						clone.instances = clone.instanceIds.map((instanceId) => {
							const instance = split.quoted[instanceId];
							if (instance != null) {
								return instance;
							}
						});
					}
				}

				if (clone.instances != null) {
					clone.holdings = 0;
					clone.instances.forEach((instance) => {
						clone.holdings += getAtPath(instance, ['@reverse', 'itemOf', '*', '@id']).length;
					});
				}
			}

			return clone;
		},

	},
});