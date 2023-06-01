<script lang="ts">
import { mapState } from 'pinia';
import { useSearchResults } from './store';
import Facets from '@/components/Facets.vue';
import Query from './Query.vue';
import PaginationControls from '@/components/PaginationControls.vue';
import KnowledgeCard from '@/views/KnowledgeCard/index.vue';

export default {
	components: {
		Facets,
		Query,
		PaginationControls,
		KnowledgeCard,
	},
	data: () => ({
		facetModal: false,
	}),
	computed: {
		...mapState(useSearchResults, ['search']),
		item() {
			if (this.search != null && this.search.mapping != null) {
				return this.search.mapping.find((map) =>
					map.variable == 'o'
				);
			}

			return null;
		},
	},
	watch: {
		'$route.fullPath'() {
			document.documentElement.scrollTo(0, 0);
		},
	},
};
</script>

<template>
	<div class="flex flex-col-reverse lg:flex-row gap-x-5">
		<div class="flex flex-col md:flex-row gap-x-5 w-full lg:w-9/12">
			<div class="w-full md:w-1/4">
				<h3 class="text-2xl text-secondary-grey font-semibold mb-2">
					Förfina urvalet
				</h3>

				<Facets />
			</div>

			<div class="w-full md:w-3/4">
				<Query />

				<div class="mt-6 pt-6 border-t border-t-secondary-grey/20">
					<PaginationControls />
				</div>
			</div>
		</div>

		<div class="w-full lg:w-3/12">
			<KnowledgeCard v-if="item != null" :id="item.object['@id']" />
		</div>
	</div>
</template>

1920

kolumn 1: 360
kolumn 2: 1040
kolumn 3: 460