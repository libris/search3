import { defineStore } from "pinia";

export const useQueryStore = defineStore('query', {
	state: () => ({
		GenreForm: [],
		Topic: [],
		Language: [],
		q: '',
	}),
});