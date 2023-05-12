<script lang="ts">
import Facets from '@/components/Facets.vue';
import Query from './Query.vue';

export default {
	components: {
		Facets,
		Query,
	},
};
</script>

<template>
	<div className="flex gap-x-10">
		<div className="w-1/4">
			<h3 className="font-semibold mb-2">
				Förfina sökning
			</h3>

			<Facets />
		</div>

		<Query />
	</div>
</template>