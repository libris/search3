<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';
import { useQueryStore } from '@/stores/query';
import { getFnurgelFromUri, getWorkImageUrl} from '@/lib/item';
import Grid from '../../components/Grid.vue';
import Facets from '../../components/Facets.vue';

export default {
	components: {
		Facets,
		Grid,
	},
	computed: {
		...mapState(useQueryStore, []),
		...mapState(useSearchResults, {
			books: 'booksFromQuery',
		}),
	},
	methods: {
		...mapActions(useSearchResults, ['query']),
		getWorkImageUrl,
		getFnurgelFromUri,
		routerPath(id: string) {
			return `/${getFnurgelFromUri(id)}`;
		},
	},
	mounted() {
		console.log('books', JSON.parse(JSON.stringify(this.books)));
		this.query();
	},
	watch: {
		books: (value) => {
			console.log('books', JSON.parse(JSON.stringify(value)));
		}
	}
};
</script>

<template>
	<div className="flex gap-x-6">
		<div className="w-1/4">
			<h3 className="font-semibold mb-2">
				Förfina sökning
			</h3>

			<Facets />
		</div>

		<Grid>
			<div v-for="book in books" :key="book['@id']">
				<router-link :to="this.routerPath(book['@id'])" :title="book.title">
					<div
						class="w-full pt-[90%] bg-no-repeat bg-contain bg-center"
						:style="{ backgroundImage: 'url(' + getWorkImageUrl(book) + ')' }"
					/>
				</router-link>

				<div class="mt-2">
					<strong>
						<router-link :to="this.routerPath(book['@id'])" :title="book.title">
							{{ book.title }}
						</router-link>
					</strong>

					<strong v-if="book.originDate != null">
						&bull; {{ book.originDate }}
					</strong>
				</div>

				<div v-if="book.author != null" class="text-sm text-secondary-grey">
					{{ book.author.name }}
				</div>

				<!--
				<div class="flex flex-wrap mt-2 gap-1">
					<div
						v-if="book.language != null"
						class="rounded-full text-xs px-2 py-1 bg-signal-yellow text-primary-white"
					>
						{{ 'book.language.label' }}
					</div>
				</div>
				-->
			</div>
		</Grid>
	</div>
</template>