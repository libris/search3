<template>
	<div
		class="flex items-center justify-center border border-secondary-turquoise rounded-full w-12 h-12 cursor-pointer"
		:class="{ ['text-secondary-turquoise']: !bookmarked, ['bg-secondary-turquoise text-primary-white']: bookmarked }"
		@click="toggleBookmark(this.id)"
	>
		<font-awesome-icon icon="fa fa-bookmark" />
	</div>
</template>

<script lang="ts">
import { useBookmarksStore } from '@/stores/bookmarks';
import { mapActions } from 'pinia';

export default {
	name: 'BookmarkButton',
	props: {
		id: {
			type: String,
		},
	},
	computed: {
		bookmarked() {
			if (this.id == null) return false;
			return this.isBookmarked(this.id);
		},
	},
	methods: {
		...mapActions(useBookmarksStore, ['toggleBookmark', 'isBookmarked']),
	},
};
</script>