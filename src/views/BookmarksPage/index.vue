<template>
	<div>
		<h1 class="text-3xl">Mina bokmärken</h1>

		<div class="flex flex-col gap-y-6 mt-4">
			<RecordListItem
				v-for="id in bookmarks"
				:key="id"
				:id="id"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { useBookmarksStore } from '@/stores/bookmarks';
import { mapState } from 'pinia';
import RecordListItem from '@/components/RecordListItem.vue';

export default {
	name: 'Bookmarks',
	components: {
		RecordListItem,
	},
	computed: {
		...mapState(useBookmarksStore, ['bookmarks']),
	},
};
</script>