<script lang="ts">
import Facets from '@/components/Facets.vue';
import Query from './Query.vue';
import PaginationControls from '@/components/PaginationControls.vue';

export default {
	components: {
		Facets,
		Query,
		PaginationControls,
	},
	data: () => ({
		facetModal: false,
	}),
	watch: {
		'$route.fullPath'() {
			document.documentElement.scrollTo(0, 0);
		},
	},
};
</script>

<template>
	<div class="flex flex-col md:flex-row gap-x-10">
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
</template>