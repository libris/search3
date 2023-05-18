<template>
	<div>
		<h1 class="text-3xl">Mina bokmärken</h1>

		<div class="mt-4">
			<router-link
				v-for="id in bookmarks"
				:key="id"
				:to="getBookmarkLink(id)"
				class="block py-4 px-2 border-b border-b-secondary-grey/20"
			>
				{{ id }}
			</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { useBookmarksStore } from '@/stores/bookmarks';
import { mapState } from 'pinia';

export default {
	name: 'Bookmarks',
	computed: {
		...mapState(useBookmarksStore, ['bookmarks']),
	},
	methods: {
		getBookmarkLink(id) {
			return id.split('/').pop();
		},
	},
	mounted() {
		console.log('bookmarks', JSON.parse(JSON.stringify(this.bookmarks)));
	}
};
</script>