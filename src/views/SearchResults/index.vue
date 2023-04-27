<script lang="ts">
import { mapActions, mapState, mapWritableState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';
import { useQueryStore } from '@/stores/query';
import { getFnurgelFromUri, getWorkImageUrl} from '@/lib/item';
import Grid from '../../components/Grid.vue';
import Facets from '../../components/Facets.vue';

export default {
	data: () => ({
		selectedFacets: [],
	}),
	components: {
		Facets,
		Grid,
	},
	computed: {
		...mapWritableState(useQueryStore, ['facets']),
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
			<div class="mt-4" v-for="book in books" :key="book['@id']">
				<router-link :to="this.routerPath(book['@id'])" :title="book.title">
					<div
						class="w-full pt-[70%] bg-no-repeat bg-contain bg-center"
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