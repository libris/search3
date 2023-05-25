<script lang="ts">
import Facets from '@/components/Facets.vue';
import Query from './Query.vue';
import { getQueryParams } from '@/lib/http';

export default {
	components: {
		Facets,
		Query,
	},
	beforeRouteLeave(to, from) {
		Object.keys(localStorage).forEach((key) => {
			if (key.indexOf('scroll-') == 0) {
				localStorage.removeItem(key);
			}
		});

		const queryParams = getQueryParams(from.fullPath);
		if (queryParams['_offset'] != null) {
			localStorage.setItem('scroll-' + window.location.href, document.scrollingElement.scrollTop + '');
		}
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