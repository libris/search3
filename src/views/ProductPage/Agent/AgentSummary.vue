<script lang="ts">
import { useProductStore } from '@/views/ProductPage/store';
import { mapState } from 'pinia';
import { getCard, getDisplayProperties, getItemLabel } from '@/lxljs/display';
import { getResources } from '@/lib/resources';
import { getPropertyLabel } from '@/lib/item';
import getSettings from '@/lib/settings';

import Query from '@/views/SearchResults/Query.vue';
import Card from '@/components/Card.vue';
import PropertyDisplay from '@/components/PropertyDisplay.vue';
import Facets from '@/components/Facets.vue';
import PaginationControls from '@/components/PaginationControls.vue';
import SearchControls from '@/components/SearchControls.vue';

export default {
	name: 'PersonSummary',
	components: {
		Query,
		Card,
		PropertyDisplay,
		Facets,
		PaginationControls,
		SearchControls,
	},
	methods: {
		getLabel(label) {
			return getPropertyLabel(label);
		},
		getValue(key) {
			const value = this.itemData[key];

			if (value != null && typeof value == 'object') {
				const card = getCard(this.itemData, getResources(), this.quoted, getSettings());
				if (card.hasOwnProperty(key)) {
					return card[key];
				}
			}

			return value;
		},
	},
	computed: {
		...mapState(useProductStore, {
			person: 'mainEntity',
		}),
		...mapState(useProductStore, ['quoted']),
		searchValue() {
			return `?@type=Work&_limit=20&o=${encodeURI(this.person['@id'])}`;
		},
		properties() {
			const chip = getDisplayProperties(this.person['@type'], getResources(), getSettings(), 'chips');
			const properties = getDisplayProperties(this.person['@type'], getResources(), getSettings(), 'full');
			return properties.filter((property) =>
				!chip.includes(property) && this.getValue(property) != null
			);
		},
		itemData() {
			if (this.person.hasOwnProperty('@type')) {
				return this.person;
			}

			return this.quoted[this.mainEntity['@id']];
		},
		itemLabel() {
			if (this.person != null) {
				return getItemLabel(this.person, getResources(), this.quoted, getSettings());
			}

			return null;
		},
	},
};
</script>

<template>
	<div>
		<h2 class="flex text-3xl font-semibold">
			{{ itemLabel }}
		</h2>
	</div>

	<div class="mt-4">
		<Card>
			<div v-for="key in properties" class="mb-4">
				<PropertyDisplay
					:label="getLabel(key)"
					:value="getValue(key)"
				/>
			</div>
		</Card>
	</div>

	<div class="mt-8 flex flex-col md:flex-row gap-x-10">
		<div class="w-full md:w-1/4">
			<Facets />
		</div>

		<div class="w-full md:w-3/4">
			<SearchControls :queryString="searchValue" />
			<Query :queryString="searchValue" :display-view-options="true" />

			<div class="mt-6 pt-6 border-t border-t-secondary-grey/20">
				<PaginationControls />
			</div>
		</div>
	</div>
</template>
