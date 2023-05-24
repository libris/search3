<script lang="ts">
import { getResources } from '@/lib/resources';
import { getItemLabel } from '@/lxljs/display';
import settings from '@/lib/settings';
import { mapState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';

export default {
	name: 'SelectedFacets',
	computed: {
		...mapState(useSearchResults, ['search']),
		list() {
			if (this.search != null && this.search.mapping != null) {
				return this.search.mapping.map((o) =>
					this.getFacetObject(o)
				).filter((facet) => facet);
			}

			return [];
		},
	},
	methods: {
		getFacetObject(o) {
			if (o.object == null) {
				return null;
			}

			if (o.variable == '@type') {
				return null;
			}

			let label;
			let link;
			if (o.object.hasOwnProperty('@id')) {
				label = getItemLabel(
					o.object,
					getResources(),
					null,
					settings,
				);
			} else {
				label = this.determineLabel(o.object);
			}

			if (!label) {
				label = o.object.label;
			}

			if (o.up != null) {
				link = o.up['@id'];
			}

			return {
				label,
				link,
				object: o.object,
				amount: o.totalItems,
			};
		},
		determineLabel(object) {
			if (object.hasOwnProperty('mainEntity')) {
				object = object.mainEntity;
			}

			for (const prop of ['@id', '_key']) {
				if (object.hasOwnProperty(prop)) {
					const chains = settings.propertyChains;
					const id = object[prop];
					if (chains.hasOwnProperty(id)) {
						return chains[id][settings.language];
					}
					if (chains.hasOwnProperty(`${id}.@id`)) {
						return chains[`${id}.@id`][settings.language];
					}
				}
			}

			if (object.hasOwnProperty('propertyChainAxiom')) {
				return object.propertyChainAxiom
					// .map(o => this.$options.filters.capitalize(this.determineLabel(o)))
					.join('/');
			}

			const label = getItemLabel(
				object,
				getResources(),
				{},
				settings,
				object['@type'],
			);

			if (label) {
				return label;
			}

			const idArray = object['@id'].split('/');
			return `${idArray[idArray.length - 1]} [has no label]`;
		},
	},
};
</script>

<template>
	<div v-if="list.length > 0">
		<h4 class="font-semibold mb-2">
			Valda filter
		</h4>

		<div class="flex flex-wrap gap-2">
			<router-link
				v-for="facet in list"
				:key="facet.link"
				:to="facet.link"
				class="flex items-center px-2 py-1 rounded-md"
				style="background-color: #d8e5e5;"
			>
				{{ facet.label }}

				<font-awesome-icon icon="fa-solid fa-xmark" class="text-xl ml-2 mt-1" style="color: #007688;" />
			</router-link>
		</div>
	</div>
</template>