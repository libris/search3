import { defineStore } from "pinia";
import { usePreferencesStore } from "./preferences";

export const useI18nStore = defineStore('i18n', {
	state: () => ({
		current: null,
		source: null,
		availableLanguages: [],
	}),
	actions: {
		async _init() {
			const preferencesStore = usePreferencesStore();
			const result = await fetch('./json/i18n.json').then((response) =>
				response.json()
			);

			this.availableLanguages = Object.keys(result);
			this.current = result[preferencesStore.language];
			this.source = result;

			preferencesStore.$subscribe((mutation) => {
				if (mutation.events.key === 'language') {
					this.current = result[mutation.events.newValue];
				}
			});
		},
	},
});