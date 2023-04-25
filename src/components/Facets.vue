<template>
			<!-- FACET GROUP <div class="flex flex-wrap mt-2 gap-1">
				<div
					class="rounded-full text-xs px-2 py-1 bg-secondary-turquoise text-primary-white cursor-pointer"
					:class="attributes.find((att) => att['@id'] == genre['@id']) != null ? 'opacity-100' : 'opacity-70'"
					v-for="genre in GenreForm"
					v-bind:key="genre['id']"
					@click="$emit('attributeSelect', genre)"
				>
					{{genre.prefLabel}}
				</div>
			</div> -->

	<div class="grid grid-cols-2 gap-x-6 gap-y-10">
		<FacetGroup
			v-for="(dimensionValue, dimensionKey, index) in sortedFacets"
			:key="dimensionKey"
			:group="dimensionValue"
		/>
	</div>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';
import settings from '@/lib/settings';
import FacetGroup from './FacetGroup.vue';

export default {
	name: 'Facets',
	components: {
		FacetGroup,
	},
	props: [
		'attributes'
	],
	computed: {
		...mapState(useSearchResults, ['stats']),

		sortedFacets(): Object {
			if (this.stats == null) {
				return [];
			}

			const facetSettings = settings.propertyChains;
			const unordered = this.stats.sliceByDimension;
			const cmp = dim => (facetSettings.hasOwnProperty(dim) ? facetSettings[dim].facet.order : Number.MAX_VALUE);
			const ordered = Object
				.keys(unordered)
				.sort((a, b) => cmp(unordered[a].dimension) - cmp(unordered[b].dimension))
				.reduce((_sortedObj, key) => ({
					..._sortedObj,
					[key]: unordered[key],
				}), {});

			return ordered;
		},
	},
};
</script>
