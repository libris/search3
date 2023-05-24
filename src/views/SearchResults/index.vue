<script lang="ts">
import Facets from '@/components/Facets.vue';
import Query from './Query.vue';

export default {
	components: {
		Facets,
		Query,
	},
	watch: {
		'$route.fullPath'() {
			document.documentElement.scrollTo(0, 0);
		},
	},
};
</script>

<template>
	<div class="flex gap-x-10">
		<div class="w-1/4">
			<h3 class="text-2xl text-secondary-grey font-semibold mb-2">
				Förfina urvalet
			</h3>

			<Facets />
		</div>

		<div class="w-3/4">
			<Query />
		</div>
	</div>
</template>