import { defineStore } from "pinia";

export const useI18nStore = defineStore('i18n', {
	state: () => ({
		current: null,
		source: null,
	}),
	actions: {
		async _init() {
			const result = await fetch('./json/i18n.json').then((response) =>
				response.json()
			);

			// TODO: Fancy fix this l8er
			this.current = result['sv'];
			this.source = result;
		},
	},
});