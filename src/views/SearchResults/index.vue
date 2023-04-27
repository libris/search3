<script lang="ts">
import { mapActions, mapState, mapWritableState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';
import { useQueryStore } from '@/stores/query';
import Grid from '@/components/Grid.vue';
import Facets from '@/components/Facets.vue';
import BookListItem from '@/components/BookListItem.vue';

export default {
	data: () => ({
		selectedFacets: [],
	}),
	components: {
		Facets,
		Grid,
		BookListItem,
	},
	computed: {
		...mapWritableState(useQueryStore, ['facets']),
		...mapState(useSearchResults, {
			books: 'booksFromQuery',
		}),
	},
	methods: {
		...mapActions(useSearchResults, ['query']),
	},
	mounted() {
		this.query();
	},
	watch: {
		books(value) {
			console.log('books', JSON.parse(JSON.stringify(value)));
		},
		selectedFacets() {
			this.facets = this.selectedFacets;
			this.query();
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

		<Grid>
			<BookListItem
				v-for="book in books"
				:key="book['@id']"
				:book="book"
			/>
		</Grid>
	</div>
</template>