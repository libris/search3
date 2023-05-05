<script lang="ts">
import { getResources } from '@/lib/resources';
import { getItemLabel } from '@/lxljs/display';
import settings from '@/lib/settings';
import Facet from './Facet.vue';
import { getCompactNumber } from '@/lib/math';

export default {
	name: 'FacetGroup',
	components: {
		Facet,
	},
	props: {
		group: Object,
	},
	computed: {
		groupLabel() {
			const facetType = this.group.dimension;
			return (settings.propertyChains[facetType] || {})[settings.language] || facetType;
		},
		list() {
			const list = this.group.observation.map(this.getFacetObject);
			return list;
		},
	},
	methods: {
		getFacetObject(o) {
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

			if (o.view != null) {
				link = o.view['@id'];
				link = link.replace('and-contribution.agent.@id', 'o')
			}

			// label = this.$options.filters.capitalize(label);

			return {
				label,
				link,
				object: o.object,
				amount: o.totalItems,
				featured: this.featuredComparison(o),
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
		featuredComparison(facet) {
			if (this.group.dimension === '@reverse.itemOf.heldBy.@id') {
				// Featured code for '@reverse.itemOf.heldBy.@id'
				const userSigels = [];
				if (facet.object.hasOwnProperty('sigel')) {
					return userSigels.indexOf(facet.object.sigel) > -1;
				}
				if (facet.object.hasOwnProperty('@id')) {
					const keyParts = facet.object['@id'].split('/');
					const label = keyParts[keyParts.length - 1];
					return userSigels.indexOf(label) > -1;
				}
			}
			return false;
		},
		getFacetLabel(facet) {
			if (facet.amount != null) {
				return facet.label + ' (' + getCompactNumber(facet.amount) + ')';
			}

			return facet.label;
		},
	},
};
</script>

<template>
	<div>
		<h4 className="text-sm text-secondary-grey mb-1">
			{{ groupLabel }}
		</h4>

		<div v-for="facet in list" :key="facet.link" class="mb-1 last-of-type:mb-0">
			<!-- <Facet :facet="facet" /> -->
			<router-link :to="facet.link" class="underline">
				{{ getFacetLabel(facet) }}
			</router-link>
		</div>
	</div>
</template>