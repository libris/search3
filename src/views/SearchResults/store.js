import { defineStore } from "pinia";

export const useSearchResults = defineStore('searchResults', {
	state: () => ({
		stats: null,
		search: null,
	}),
});
