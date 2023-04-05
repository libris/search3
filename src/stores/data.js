import { defineStore } from "pinia";
import { getItemById } from "@/lib/item";
import { getItemsByRelation } from "../lib/item";
import { useQueryStore } from "./query";

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
			const queryStore = useQueryStore();

			return state.Book
			.filter((book) => {
				if (queryStore.freeText.length > 0) {
					return book.title.toLowerCase().indexOf(queryStore.freeText.toLowerCase()) > -1;
				}

				return true;
			})
			.filter((book) => {
				if (queryStore.Language.length > 0) {
					return queryStore.Language.findIndex((lang) => lang['@id'] === book.language['@id']) > -1;
				}

				return true;
			})
			.filter((book) => {
				if (queryStore.GenreForm.length > 0) {
					return queryStore.GenreForm.findIndex((genre) =>
						book.genreForm.find((_g) => _g['@id'] === genre['@id']) != null
					) > -1;
				}

				return true;
			})
			.filter((book) => {
				if (queryStore.Topic.length > 0) {
					return queryStore.Topic.findIndex((topic) =>
						book.subject?.find((_s) => _s['@id'] === topic['@id']) != null
					) > -1;
				}

				return true;
			})
		},
	},
	actions: {
		async _init() {
			const data = await fetch('/data.jsonld').then((response) =>
				response.json()
			);

			this.current = data;
			this.memoIndexData();
		},

		memoIndexData() {
			if (this.current == null) {
				return false;
			}

			const stateKeys = Object.keys(this.$state);

			this.current['@graph'].forEach((item) => {
				if (stateKeys.indexOf(item['@type']) > -1) {
					this.$state[item['@type']].push(this.expressItem(item));
				}
			});

			stateKeys.forEach((stateKey) => {
				if (Array.isArray(this.$state[stateKey])) {
					this.$state[stateKey] = this.$state[stateKey].map(this.buildRelations);
				}
			});

			console.log(JSON.parse(JSON.stringify(this.Book)));
			console.log(JSON.parse(JSON.stringify(this.WorkConcept)));
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

				return result;
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

	},
});