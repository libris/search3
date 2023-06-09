import { defineStore } from "pinia";

type Preferences = {
	displayMode: 'grid' | 'list' | 'table',
	selectedLanguage: 'sv' | 'en',
};

export const usePreferencesStore = defineStore('preferences', {
	state: (): Preferences => ({
		displayMode: 'list',
		selectedLanguage: 'sv',
	}),
	persist: {
		enabled: true,
	},
});
