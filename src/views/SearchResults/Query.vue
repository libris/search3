<script lang="ts">
import { PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';
import Grid from '@/components/Grid.vue';
import BookListItem from '@/components/BookListItem.vue';
import Card2 from "@/components/Card2.vue";

export default {
	name: 'Query',
	props: {
		queryString: {
			type: String,
			default: null,
		},
		mode: {
			type: String as PropType<'search' | 'preview'>,
			default: 'search',
		},
	},
	components: {
		Grid,
		BookListItem,
		Card2,
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
		<template #top v-if="item != null && queryString == null">
			<Card2 :data="item.object" />
		</template>

		<BookListItem
			v-for="book in books"
			:key="book['@id']"
			:book="book"
			:displayMode="mode == 'preview' ? 'small' : null"
		/>
	</Grid>
</template>