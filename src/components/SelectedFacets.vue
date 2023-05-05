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

			// label = this.$options.filters.capitalize(label);

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
		<div v-for="facet in list" :key="facet.link" class="mb-1 last-of-type:mb-0">
			<font-awesome-icon icon="fa-solid fa-xmark" class="mr-1" />
			<router-link :to="facet.link" class="underline">
				{{ facet.label }}
			</router-link>
		</div>
	</div>
</template>