<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';
import Grid from '@/components/Grid.vue';
import BookListItem from '@/components/BookListItem.vue';

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
	},
	computed: {
		...mapState(useSearchResults, {
			books: 'booksFromQuery',
		}),
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
	}
};
</script>

<template>
	<Grid :displayViewOptions="queryString == null">
		<BookListItem
			v-for="book in books"
			:key="book['@id']"
			:book="book"
		/>
	</Grid>
</template>