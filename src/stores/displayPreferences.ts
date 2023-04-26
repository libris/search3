import { defineStore } from "pinia";

type DisplayPreferences = {
	mode: 'cards' | 'list' | 'compactlist',
};

export const useDisplayPreferences = defineStore('displayPreferences', {
	state: (): DisplayPreferences => ({
		mode: 'cards',
	}),
});
