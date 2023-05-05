<script lang="ts">
import { mapState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';
import Facets from '@/components/Facets.vue';
import Query from './Query.vue';

export default {
	components: {
		Facets,
		Query,
	},
	computed: {
		...mapState(useSearchResults, {
			books: 'booksFromQuery',
		}),
	},
	watch: {
		books(value) {
			console.log('books', JSON.parse(JSON.stringify(value)));
		},
	}
};
</script>

<template>
	<div className="flex gap-x-10">
		<div className="w-1/4">
			<h3 className="font-semibold mb-2">
				Förfina sökning
			</h3>

			<Facets />
		</div>

		<Query />
	</div>
</template>