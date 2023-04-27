<template>
	<div class="flex flex-col gap-y-6">
		<div v-if="Object.keys(sortedFacets).length == 0" class="text-secondary-grey">
			Inga förslag hittades
		</div>

		<FacetGroup
			v-for="(dimensionValue, dimensionKey, index) in sortedFacets"
			:key="dimensionKey"
			:group="dimensionValue"
			@change="onGroupChange"
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
	emits: ['update:facets'],
	data: () => ({
		queries: {},
	}),
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
				return {};
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
	methods: {
		onGroupChange(value) {
			const newValue = {...this.queries}
			newValue[value.dimension] = value.selected;
			this.queries = newValue;
		},
	},
	watch: {
		queries() {
			let results = [];
			Object.keys(this.queries).forEach((dimension) =>
				results.push(...this.queries[dimension])
			);

			this.$emit('update:facets', results);
		}
	}
};
</script>
