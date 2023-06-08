<script lang="ts">
import { getResources } from '@/lib/resources';
import { getItemLabel } from '@/lxljs/display';
import { getCompactNumber } from '@/lib/math';
import { capitalize } from '@/lib/item';
import getSettings from '@/lib/settings';

import Facet from './Facet.vue';
import Expandable from './Expandable.vue';

export default {
	name: 'FacetGroup',
	components: {
		Facet,
		Expandable,
	},
	data: () => ({
		isExpanded: true,
	}),
	props: {
		group: Object,
	},
	computed: {
		groupLabel() {
			const settings = getSettings();
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
					getSettings(),
				);
			} else {
				label = this.determineLabel(o.object);
			}

			if (!label) {
				label = o.object.label;
			}

			if (o.view != null) {
				link = o.view['@id'];
			}

			return {
				label: capitalize(label),
				link,
				object: o.object,
				amount: o.totalItems,
				featured: this.featuredComparison(o),
			};
		},
		determineLabel(object) {
			const settings = getSettings();
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
					.map(o => (this.getLabel(o)))
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
		getLabel(o) {
			const settings = getSettings();
			if (o.hasOwnProperty('labelByLang')) {
				return o.labelByLang[settings.language];
			} else if (o.hasOwnProperty('titleByLang')) {
				return o.titleByLang[settings.language];
			} else if (o.hasOwnProperty('prefLabelByLang')) {
				return o.prefLabelByLang[settings.language];
			} else if (o.hasOwnProperty('label')) {
				return o.label;
			} else if (o.hasOwnProperty('code')) {
				return o.code;
			}
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
			return facet.label;
		},
		getFacetNumber(facet) {
			if (facet.amount != null) {
				return getCompactNumber(facet.amount);
			}

			return null;
		},
		facetClick() {
			document.documentElement.scrollTo(0, 0);
		},
	},
};
</script>

<template>
	<div class="border border-secondary-grey/20 rounded-lg px-3 py-4">
		<div
			class="flex justify-between items-center cursor-pointer"
			@click="isExpanded = !isExpanded"
		>
			<h4 class="font-semibold truncate" :title="groupLabel">
				{{ groupLabel }}
			</h4>

			<font-awesome-icon
				icon="fa-solid fa-chevron-up"
				class="ml-2 mt-1 transition-all duration-300"
				:class="{['rotate-180']: !isExpanded }"
			/>
		</div>

		<Expandable :show="isExpanded">
			<div class="pt-3">
				<div class="mb-3 border-t border-t-secondary-grey/20" />
				<div v-for="facet in list" :key="facet.link" class="flex justify-between items-center mb-2 last-of-type:mb-0">
					<!-- <Facet :facet="facet" /> -->
					<router-link :to="facet.link" class="underline truncate" :title="getFacetLabel(facet)" @click="facetClick">
						{{ getFacetLabel(facet) }}
					</router-link>

					<div
						class="rounded-full py-1 px-2"
						style="background-color: #e2e0de; color: #585756;"
					>
						{{ getFacetNumber(facet) }}
					</div>
				</div>
			</div>
		</Expandable>
	</div>
</template>