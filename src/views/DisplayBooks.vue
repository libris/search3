<script lang="ts">
import { mapState } from 'pinia';
import { useDataStore } from '@/stores/data';
import { useQueryStore } from '@/stores/query';

export default {
	computed: {
		...mapState(useQueryStore, []),
		...mapState(useDataStore, {
			books: 'booksFromQuery',
		}),
	},
	methods: {
		routerPath(id: string) {
			const uriParts = id.split('/');
			const fnurgel = uriParts[uriParts.length - 1];
			return `/${fnurgel}`;
		},
		imageUrl(id: string, isbn: string) {
			return `https://xinfo.libris.kb.se/xinfo/xinfo?type=record&identifier=libris-bib:${id},isbn:${isbn}`
		}
	},
	watch: {
		books: (value) => {
			console.log(JSON.parse(JSON.stringify(value)));
		}
	}
};
</script>

<template>
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
		<div v-for="book in books" :key="book['@id']">
			<div
				class="w-full pt-[100%] bg-no-repeat bg-contain bg-center"
				:style="{ backgroundImage: 'url(' + imageUrl('10145888','9789185251872') + ')', color: 'green' }"
			/>

			<div class="mt-2">
				<strong>
					<router-link :to="this.routerPath(book['@id'])" :title="book['@id']">
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

			<div class="flex flex-wrap mt-2 gap-1">
				<div
					v-if="book.genreForm != null && book.genreForm.length > 0"
					v-for="genre in book.genreForm"
					:key="genre['@id']"
					class="rounded-full text-xs px-2 py-1 bg-secondary-turquoise text-primary-white"
				>
					{{ genre.prefLabel != null ? genre.prefLabel : genre['@id'] }}
				</div>

				<div
					v-if="book.language != null"
					class="rounded-full text-xs px-2 py-1 bg-signal-yellow text-primary-white"
				>
					{{ book.language.label }}
				</div>

				<div
					v-if="book.subject != null"
					v-for="subject in book.subject"
					:bind="subject['id']"
					class="rounded-full text-xs px-2 py-1 bg-primary-orange text-primary-white"
				>
					{{ subject.prefLabel }}
				</div>
			</div>
		</div>
	</div>
</template>