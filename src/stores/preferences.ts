import { defineStore } from "pinia";

type Preferences = {
	displayMode: 'cards' | 'list' | 'table',
	language: 'sv' | 'en',
};

export const usePreferencesStore = defineStore('preferences', {
	state: (): Preferences => ({
		displayMode: 'list',
		language: 'sv',
	}),
	persist: {
		enabled: true,
	},
});
