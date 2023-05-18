import { defineStore } from "pinia";

export const useBookmarksStore = defineStore('bookmarks', {
	state: () => ({
		bookmarks: [],
	}),
	actions: {
		isBookmarked(id) {
			return this.bookmarks.indexOf(id) > -1;
		},
		toggleBookmark(id) {
			const index = this.bookmarks.indexOf(id);
			if (index === -1) {
				this.bookmarks.push(id);
			} else {
				this.bookmarks.splice(index, 1);
			}
		},
	},
	persist: {
		enabled: true,
	},
});