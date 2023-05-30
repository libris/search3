<template>
	<div class="md:hidden mb-4">
		<Button @click="() => this.modalOpen = !this.modalOpen">
			<font-awesome-icon icon="fa-solid fa-filter" class="mr-2" />
			Visa facetter
		</Button>

		<div class="mt-4">
			<SelectedFacets />
		</div>
	</div>

	<div class="hidden md:flex flex-col gap-y-6">
		<div v-if="Object.keys(sortedFacets).length == 0" class="text-secondary-grey">
			Inga förslag hittades
		</div>

		<SelectedFacets />

		<FacetGroup
			v-for="(dimensionValue, dimensionKey, index) in sortedFacets"
			:key="dimensionKey"
			:group="dimensionValue"
		/>
	</div>

	<SidebarModal v-model="modalOpen">
		<div class="flex flex-col gap-y-6">
			<div v-if="Object.keys(sortedFacets).length == 0" class="text-secondary-grey">
				Inga förslag hittades
			</div>

			<SelectedFacets />

			<FacetGroup
				v-for="(dimensionValue, dimensionKey, index) in sortedFacets"
				:key="dimensionKey"
				:group="dimensionValue"
			/>
		</div>
	</SidebarModal>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';
import settings from '@/lib/settings';
import FacetGroup from './FacetGroup.vue';
import SelectedFacets from './SelectedFacets.vue'
import SidebarModal from '@/components/Modals/Sidebar.vue';

export default {
	name: 'Facets',
	components: {
		FacetGroup,
		SelectedFacets,
		SidebarModal,
	},
	data: () => ({
		modalOpen: false,
	}),
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
};
</script>
