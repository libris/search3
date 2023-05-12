<script lang="ts">
import { PropType } from 'vue';
import { mapWritableState } from 'pinia';
import { useSearchResults } from './store';
import { getChip, getItemSummary, getItemLabel } from "@/lxljs/display";
import { getResources } from "@/lib/resources";
import { splitJson } from "@/lxljs/data";
import { getAtPath } from "@/lib/item";
import { getQueryParams, getRelatedRecords, getDocument } from '@/lib/http';
import settings from "@/lib/settings";

import Grid from '@/components/Grid.vue';
import BookListItem from '@/components/BookListItem.vue';
import KnowledgeCard from '@/views/KnowledgeCard/index.vue';

export default {
	name: 'Query',
	props: {
		queryString: {
			type: String,
			default: null,
		},
		mode: {
			type: String as PropType<'search' | 'preview'>,
			default: 'search',
		},
	},
	data: () => ({
		current: null,
		Instance: [],
		Print: [],
		Text: [],
	}),
	components: {
		Grid,
		BookListItem,
		KnowledgeCard,
	},
	computed: {
		...mapWritableState(useSearchResults, ['stats', 'search']),
		item() {
			if (this.search != null && this.search.mapping != null) {
				return this.search.mapping.find((map) =>
					map.variable == 'o'
				);
			}

			return null;
		},
	},
	methods: {
		async query(queryString) {
			const query = getQueryParams(queryString);
			const response = await getRelatedRecords(query, settings.apiPath);

			this.reset();

			this.current = response.items;
			this.stats = response.stats;
			this.search = response.search;
			this.indexData();
		},

		indexData() {
			if (this.current == null) {
				return false;
			}

			const stateKeys = Object.keys(this);

			this.current.forEach((item) => {
				if (stateKeys.indexOf(item['@type']) > -1 && Array.isArray(this[item['@type']])) {
					if (getResources().context != null) {
						const chip = getChip(item, getResources(), [], settings);
						const summary = getItemSummary(
							item,
							getResources(),
							[],
							settings,
							getResources().displayGroups,
						);

						this[item['@type']].push({
							...item,
							...summary,
							...chip,
						});
					}
				}
			});

			stateKeys.forEach((key) => {
				if (key === 'Text') {
					this[key] = this[key].map(this.calculateDisplayMeta);
					const promises = this[key].map(this.calculateFetchedMeta);

					Promise.all(promises).then((results) => {
						console.log('key, results', key, JSON.parse(JSON.stringify(results)));
						this[key] = results;
					});
				}
			});
		},

		calculateDisplayMeta(item) {
			const clone = JSON.parse(JSON.stringify(item));

			if (item['@type'] === 'Text') {
				clone.title = getItemLabel(item.hasTitle[0], getResources(), [], settings);
				if (clone.genreForm != null && Array.isArray(clone.genreForm)) {
					clone.genreFormCalculated = clone.genreForm.map((genre) => {
						return getItemLabel(genre, getResources(), [], settings);
					});
				}
				if (clone.subject != null && Array.isArray(clone.subject)) {
					clone.subjectCalculated = clone.subject.map((subject) => {
						return getItemLabel(subject, getResources(), [], settings);
					}).filter(label => !label.includes('{'));
				}
			}

			return clone;
		},

		async calculateFetchedMeta(item) {
			const clone = JSON.parse(JSON.stringify(item));
			const response = await getDocument(`${clone['@id']}/data.jsonld`);
			const split = splitJson(response.data);

			if (item['@type'] === 'Text') {
				if (clone['@reverse'].hasOwnProperty('instanceOf')) {
					clone.instanceIds = clone['@reverse']['instanceOf'].map((instance) => instance['@id']);
					if (clone.instanceIds != null) {
						clone.instances = clone.instanceIds.map((instanceId) => {
							const instance = split.quoted[instanceId];
							if (instance != null) {
								return instance;
							}
						});
					}
				}

				if (clone.instances != null) {
					clone.holdings = 0;
					clone.instances.forEach((instance) => {
						clone.holdings += getAtPath(instance, ['@reverse', 'itemOf', '*', '@id']).length;
					});
				}
			}

			return clone;
		},

		reset() {
			this.current = null;
			this.stats = null;
			this.search = null;
			this.Instance = [];
			this.Print = [];
			this.Text = [];
		},
	},
	mounted() {
		if (this.queryString != null) {
			this.query(this.queryString);
		} else {
			this.query();
		}
	},
	watch: {
		$route() {
			if (this.queryString == null) {
				this.query();
			}
		},
		Text() {
			console.log('text', JSON.parse(JSON.stringify(this.Text)));
		}
	},
};
</script>

<template>
	<Grid :displayViewOptions="queryString == null">
		<template #top v-if="item != null && queryString == null">
			<KnowledgeCard :id="item.object['@id']" />
		</template>

		<BookListItem
			v-for="book in Text"
			:key="book['@id']"
			:book="book"
			:displayMode="mode == 'preview' ? 'small' : null"
		/>
	</Grid>
</template>