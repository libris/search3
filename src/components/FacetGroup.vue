<script lang="ts">
import { getResources } from '@/lib/resources';
import { getItemLabel } from '@/lxljs/display';
import settings from '@/lib/settings';
import Facet from './Facet.vue';
import Checkbox from './Checkbox.vue';

export default {
	name: 'FacetGroup',
	components: {
		Facet,
		Checkbox,
	},
	data: () => ({
		selected: [],
	}),
	props: {
		group: Object,
	},
	computed: {
		facetLabel() {
			const facetType = this.group.dimension;
			return (settings.propertyChains[facetType] || {})[settings.language] || facetType;
		},
		list() {
			const self = this;
			const list = this.group.observation.map((o) => {
				let label;
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

				// label = this.$options.filters.capitalize(label);

				return {
					label,
					object: o.object,
					amount: o.totalItems,
					link: o.view['@id'],
					featured: self.featuredComparison(o),
				};
			});

			return list;
		}
	},
	methods: {
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
	},
};
</script>

<template>
	<div>
		<h4 className="text-sm text-secondary-grey mb-1">
			{{ facetLabel }}
		</h4>

		<div
			v-for="facet in list"
			:key="facet.link"
			class="mb-1 last-of-type:mb-0"
		>
			<!-- <Facet :facet="facet" /> -->
			<Checkbox :label="facet.label" :value="facet.link" v-model="selected" />
		</div>
	</div>
</template>