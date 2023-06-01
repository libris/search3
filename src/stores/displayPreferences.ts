import { defineStore } from "pinia";

type DisplayPreferences = {
	mode: 'cards' | 'list' | 'table',
};

export const useDisplayPreferences = defineStore('displayPreferences', {
	state: (): DisplayPreferences => ({
		mode: 'list',
	}),
	persist: {
		enabled: true,
	},
});
