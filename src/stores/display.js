import { defineStore } from "pinia";
import { getDisplayDefinitions } from "../lib/data";

export const useDisplayStore = defineStore('display', {
	state: () => ({
		current: null,
		displayGroups: null,
	}),
	actions: {
		async _init() {
			const response = await getDisplayDefinitions();
			this.current = response;
			this.displayGroups = await fetch('/json/displayGroups.json').then((response) =>
				response.json()
			);
		},
	},
});