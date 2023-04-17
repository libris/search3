import { defineStore } from "pinia";
import { getDisplayDefinitions } from "../lib/data";

export const useDisplayStore = defineStore('display', {
	state: () => ({
		current: null,
	}),
	actions: {
		async _init() {
			const response = await getDisplayDefinitions();
			this.current = response;
		},
	},
});