<template>
	<div class="mb-8" v-if="mainEntity != null">
		<h2 class="flex text-3xl font-semibold mb-4">
			{{ itemLabel }}
		</h2>

		<div class="flex gap-x-4 items-start">
			<Card class="flex-1">
				<div v-for="key in Object.keys(card)" class="border-b py-1 border-secondary-grey/20 mb-2 last-of-type:border-0 last-of-type:mb-0">
					<strong>
						{{ getLabel(key) }}
					</strong>

					<span class="ml-2">
						{{ card[key] }}
					</span>
				</div>
			</Card>

			<div class="flex-shrink-0 ">
				<div class="block w-72">
					<img class="rounded-lg" :src="imageUrl" />
				</div>
				
				<div>
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
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useKnowledgeCardStore } from './store';
import { getItemLabel } from '@/lxljs/display';
import { getResources } from '@/lib/resources';
import settings from '@/lib/settings';
import { getLabelByLang } from '@/lxljs/string';
import Card from '@/components/Card.vue';

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
	},
	computed: {
		...mapState(useKnowledgeCardStore, ['mainEntity', 'card', 'chip', 'quoted', 'wikiData', 'imageUrl']),
		itemLabel() {
			if (this.mainEntity != null) {
				return getItemLabel(this.mainEntity, getResources(), this.quoted, settings);
			}

			return null;
		},
	},
	methods: {
		...mapActions(useKnowledgeCardStore, ['getProduct']),
		getLabel(label) {
			return getLabelByLang(label, settings.language, getResources());
		}
	},
	mounted() {
		if (this.id != null) {
			this.getProduct(this.id);
		}
	},
};
</script>