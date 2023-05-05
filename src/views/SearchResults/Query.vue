<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';
import Grid from '@/components/Grid.vue';
import BookListItem from '@/components/BookListItem.vue';
import KnowledgeCard from '@/views/KnowledgeCard/index.vue';

export default {
	name: 'Query',
	props: {
		queryString: {
			type: String,
			default: null,
		},
	},
	components: {
		Grid,
		BookListItem,
		KnowledgeCard,
	},
	computed: {
		...mapState(useSearchResults, {
			books: 'booksFromQuery',
			search: 'search',
		}),
		item() {
			if (this.search != null && this.search.mapping != null) {
				return this.search.mapping.find((map) =>
					map.variable == 'o'
				);
			}

			return null;
		},
	},
	methods: {
		...mapActions(useSearchResults, ['query']),
	},
	mounted() {
		if (this.queryString != null) {
			this.query(this.queryString);
		} else {
			this.query();
		}
	},
	watch: {
		$route() {
			if (this.queryString == null) {
				this.query();
			}
		},
	},
};
</script>

<template>
	<Grid :displayViewOptions="queryString == null">
		<template #top v-if="item != null">
			<KnowledgeCard :id="item.object['@id']" />

			<h3 class="text-2xl font-semibold mb-4">
				Sökresultat
			</h3>
		</template>

		<BookListItem
			v-for="book in books"
			:key="book['@id']"
			:book="book"
		/>
	</Grid>
</template>