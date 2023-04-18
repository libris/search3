import { defineStore } from "pinia";
import { getItemById } from "@/lib/item";
import { getItemsByRelation } from "../../lib/item";
import { getRelatedRecords } from '@/lib/http';
import { useVocabStore } from "../../stores/vocab";

export const useDataStore = defineStore('data', {
	state: () => ({
		current: null,
		AudioBook: [],
		Book: [],
		DigitalReproduction: [],
		EBook: [],
		GenreForm: [],
		Language: [],
		Manuscript: [],
		Movie: [],
		Organization: [],
		Performance: [],
		Person: [],
		Play: [],
		PrintedVolume: [],
		SpokenBook: [],
		Topic: [],
		VideoRecording: [],
		WorkConcept: [],

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
		async _init() {
			const vocabStore = useVocabStore();
			const response = await getRelatedRecords({
				'q': '*',
				'_limit': 20,
				'@type': 'Work',
				'_sort': '',
			}, 'http://kblocalhost.kb.se:5000');

			this.current = response.items;
			this.memoIndexData();

			vocabStore.$subscribe((mutation) => {
				if (mutation.type === 'direct') {
					Object.keys(this.$state).forEach((stateKey) => {
						if (stateKey === 'graph' || stateKey === 'current' || stateKey === 'context') {
							return false;
						}

						if (Array.isArray(this.$state[stateKey])) {
							this.$state[stateKey] = [];
						}
					});

					this.memoIndexData();
				}
			});
		},

		async query(values = {}) {
			if (values.q === '') {
				values.q = '*';
			}

			const response = await getRelatedRecords({
				'_limit': 20,
				'@type': 'Work',
				'_sort': '',
				...values,
			}, 'http://kblocalhost.kb.se:5000');

			this.$reset();

			console.log('query response', response);
			this.current = response.items;
			this.memoIndexData();
		},

		memoIndexData() {
			if (this.current == null) {
				return false;
			}

			const stateKeys = Object.keys(this.$state);

			this.current.forEach((item) => {
				if (stateKeys.indexOf(item['@type']) > -1) {
					this.$state[item['@type']].push(this.expressItem(item));
				}
			});

			stateKeys.forEach((stateKey) => {
				if (Array.isArray(this.$state[stateKey])) {
					this.$state[stateKey] = this.$state[stateKey].map(this.calculateDisplayMeta);
				}
			});
		},

		expressItem(item) {
			const clone = JSON.parse(JSON.stringify(item));

			if (this.current == null) {
				return null;
			}

			const expressObject = (item) => {
				let result = JSON.parse(JSON.stringify(item));
				if (item.hasOwnProperty('@id')) {
					result = getItemById(item['@id']);
				}

				return result ?? item;
			};

			const diveInKey = (_item, key) => {
				const item = JSON.parse(JSON.stringify(_item));
				if (Array.isArray(item[key])) {
					return item[key].map((subItem) => {
						if (Array.isArray(subItem)) {
							return diveInKey(subItem, key);
						}

						if (typeof subItem === 'object') {
							return expressObject(subItem);
						}
					});
				}

				if (typeof item[key] === 'object') {
					return expressObject(item[key]);
				}

				return item[key];
			};

			Object.keys(clone).forEach((itemKey) => {
				clone[itemKey] = diveInKey(clone, itemKey);
			});

			return clone;
		},

		buildRelations(item) {
			if (item['@type'] === 'Book') {
				const foundInstances = getItemsByRelation(item['@id'], 'instanceOf');
				if (foundInstances.length > 0) {
					item['instances'] = foundInstances;
				}
			}

			if (item['@type'] === 'WorkConcept') {
				const foundExpressions = getItemsByRelation(item['@id'], 'expressionOf');
				if (foundExpressions.length > 0) {
					item['expressions'] = foundExpressions;
				}
			}

			return item;
		},

		calculateDisplayMeta(item) {
			const clone = JSON.parse(JSON.stringify(item));

			if (item['@type'] === 'Text') {
				const foundTitle = clone.hasTitle?.find((title) =>
					title['@type'] === 'Title'
				);

				if (foundTitle != null) {
					clone.title = foundTitle.mainTitle;
				}
			}

			return clone;
		},

	},
});