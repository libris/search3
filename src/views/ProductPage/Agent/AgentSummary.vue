<script lang="ts">
import { useProductStore } from '@/views/ProductPage/store';
import { mapState } from 'pinia';
import { getCard, getDisplayProperties, getItemLabel } from '@/lxljs/display';
import { getResources } from '@/lib/resources';
import { getPropertyLabel } from '@/lib/item';
import settings from '@/lib/settings';

import Query from '@/views/SearchResults/Query.vue';
import Card from '@/components/Card.vue';
import PropertyDisplay from '@/components/PropertyDisplay.vue';
import Facets from '@/components/Facets.vue';

export default {
	name: 'PersonSummary',
	components: {
		Query,
		Card,
		PropertyDisplay,
		Facets
	},
	methods: {
		getLabel(label) {
			return getPropertyLabel(label);
		},
		getValue(key) {
			const value = this.itemData[key];

			if (value != null && typeof value == 'object') {
				const card = getCard(this.itemData, getResources(), this.quoted, settings);
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
			return `?@type=Text&_limit=20&o=${this.person['@id']}`;
		},
		properties() {
			const properties = getDisplayProperties(this.person['@type'], getResources(), settings, 'full');
			return properties.filter((property) =>
				this.getValue(property) != null
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
				return getItemLabel(this.person, getResources(), this.quoted, settings);
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

	<div class="mt-8 flex gap-x-10">
		<div class="w-1/4">
			<Facets />
		</div>

		<Query :queryString="searchValue" />
	</div>
</template>
