<script lang="ts">
import { mapActions, mapState, mapWritableState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';
import { useQueryStore } from '@/stores/query';
import Facets from '@/components/Facets.vue';
import Query from './Query.vue';

export default {
	data: () => ({
		selectedFacets: [],
	}),
	components: {
		Facets,
		Query,
	},
	computed: {
		...mapWritableState(useQueryStore, ['facets']),
		...mapState(useSearchResults, {
			books: 'booksFromQuery',
		}),
	},
	methods: {
		...mapActions(useSearchResults, ['query']),
		...mapActions(useQueryStore, ['redirect']),
	},
	watch: {
		books(value) {
			console.log('books', JSON.parse(JSON.stringify(value)));
		},
		selectedFacets() {
			this.facets = this.selectedFacets;
			this.redirect();
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

			<Facets v-model:facets="selectedFacets" />
		</div>

		<Query />
	</div>
</template>