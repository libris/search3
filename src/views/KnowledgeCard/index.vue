<template>
	<div class="mb-8" v-if="mainEntity != null">
		<Card class="flex-1 bg-transparent">
			<div class="flex mb-4">
				<h2 class="text-2xl font-semibold flex-1">
					{{ itemLabel }}
				</h2>

				<!-- <div class="flex-shrink-0 text-right">
					<div class="block w-28 float-right">
						<img class="rounded-lg" :src="imageUrl" />
					</div>

					<div class="clear-both">
						<a href="https://commons.wikimedia.org/wiki/User:FrankieF" target="_blank">
							Frankie Fouganthin
						</a>
					</div>

					<div class="flex gap-1">
						<div v-if="wikiData != null">
							<a :href="wikiData['@id']" target="_blank">
								Wikidata
							</a>
						</div>

						&bull;

						<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en" target="_blank">
							© CC BY-SA 4.0
						</a>
					</div>
				</div> -->
			</div>

			<div v-for="key in (Object.keys(card).filter(k => !Object.keys(chip).includes(k)))" class="border-secondary-grey/20 mb-4 last-of-type:mb-0">
				<PropertyDisplay
					:label="getLabel(key)"
					:value="card[key]"
				/>
			</div>
		</Card>
	</div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useKnowledgeCardStore } from './store';
import { getItemLabel } from '@/lxljs/display';
import { getResources } from '@/lib/resources';
import getSettings from '@/lib/settings';
import { getPropertyLabel } from "@/lib/item";

import Card from '@/components/Card.vue';
import PropertyDisplay from '@/components/PropertyDisplay.vue';

export default {
	name: 'KnowledgeCard',
	props: {
		id: {
			type: String,
			default: null,
		}
	},
	components: {
		Card,
		PropertyDisplay
	},
	computed: {
		...mapState(useKnowledgeCardStore, ['mainEntity', 'card', 'chip', 'quoted', 'wikiData', 'imageUrl']),
		itemLabel() {
			if (this.mainEntity != null) {
				return getItemLabel(this.mainEntity, getResources(), this.quoted, getSettings());
			}

			return null;
		},
	},
	methods: {
		...mapActions(useKnowledgeCardStore, ['getProduct']),
		getLabel(label) {
			return getPropertyLabel(label);
		}
	},
	mounted() {
		if (this.id != null) {
			this.getProduct(this.id);
		}
	},
};
</script>