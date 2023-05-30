import { defineStore } from "pinia";

export const useSearchResults = defineStore('searchResults', {
	state: () => ({
		stats: null,
		search: null,
		first: null,
		last: null,
		next: null,
		previous: null,
		totalItems: null,
	}),
});
