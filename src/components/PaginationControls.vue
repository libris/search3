<template>
	<div class="flex items-center gap-x-3">
		<div v-if="first != null">
			<router-link :to="first['@id']">
				<Button>
					{{ translatePhrase('First') }}
				</Button>
			</router-link>
		</div>

		<div v-if="previous != null">
			<router-link :to="previous['@id']">
				<Button>
					{{ translatePhrase('Previous') }}
				</Button>
			</router-link>
		</div>

		<ul class="w-full flex items-center justify-evenly">
			<li v-for="page in pageItems" :key="page.number">
				<router-link :to="page['@id']" class="underline underline-offset-8"
					:class="{ 'text-primary-blue': page.active, 'font-semibold': page.active }">
					{{ page.number + 1 }}
				</router-link>
			</li>
		</ul>

		<div v-if="next != null">
			<router-link :to="next['@id']">
				<Button>
					{{ translatePhrase('Next') }}
				</Button>
			</router-link>
		</div>

		<div v-if="last != null">
			<router-link :to="last['@id']">
				<Button>
					{{ translatePhrase('Last') }}
				</Button>
			</router-link>
		</div>
	</div>

	<div class="text-secondary-grey mt-4">
		{{ capitalize(translatePhrase(['Showing', getResultRange(), 'of', totalItems, 'Hits'])) }}
	</div>
</template>

<script lang="ts">
import { getSearchParamValue } from '@/lib/http';
import { useSearchResults } from '@/views/SearchResults/store';
import { mapState } from 'pinia';
import { translatePhrase } from '@/lib/item';
import { capitalize } from '@/lib/item';
import Button from './Button.vue';

export default {
	name: 'PaginationControls',
	components: {
		Button,
	},
	computed: {
		...mapState(useSearchResults, ['first', 'last', 'next', 'previous', 'totalItems']),
		pageItems() {
			const pages = [];

			if (this.first == null) {
				return pages;
			}

			const itemsPerPage = getSearchParamValue('_limit');
			const currentPage = this.getCurrentPage();
			const lastPage = this.getLastPage();
			const numberOfItems = 9;

			const createPage = (number) => {
				const perPage = itemsPerPage;
				const offset = (number) * perPage;
				const uri = `${this.first['@id']}&_offset=${offset}`;
				return {
					number,
					'@id': uri,
					active: number === currentPage,
				};
			};

			const paddedPages = numberOfItems * 0.5;
			const minPage = currentPage - paddedPages < 0 ? 0 : currentPage - paddedPages;
			let maxPage = currentPage + paddedPages > lastPage ? lastPage : currentPage + paddedPages;
			if (minPage === 0) {
				maxPage += (currentPage - paddedPages) * -1;
			}
			if (maxPage === 0) {
				return [createPage(0)];
			}
			if (maxPage > lastPage) {
				maxPage = lastPage;
			}

			for (let i = Math.ceil(minPage); i < Math.ceil(maxPage); i++) {
				pages.push(createPage(i));
			}

			return pages;
		},
	},
	methods: {
		translatePhrase,
		capitalize,
		getLastPage() {
			const itemsPerPage = parseInt(getSearchParamValue('_limit'));
			return this.totalItems / itemsPerPage;
		},
		getCurrentPage() {
			const currentOffset = parseInt(getSearchParamValue('_offset'));
			const perPage = parseInt(getSearchParamValue('_limit'));
			const page = (currentOffset / perPage);
			return page;
		},
		getResultRange() {
			const first = parseInt(getSearchParamValue('_offset')) + 1;
			let last = parseInt(getSearchParamValue('_offset')) + parseInt(getSearchParamValue('_limit'));

			if (last > this.totalItems) {
				last = this.totalItems;
			}

			return `${first}-${last}`;
		},
	},
};
</script>