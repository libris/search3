<script lang="ts">
import { PropType } from 'vue';
import { mapWritableState } from 'pinia';
import { useSearchResults } from './store';
import { getItemLabel } from "@/lxljs/display";
import { getResources } from "@/lib/resources";
import { splitJson } from "@/lxljs/data";
import { asArray, getAtPath, getFnurgelFromUri, unwrap } from "@/lib/item";
import { getQueryParams, getRelatedRecords, getDocument, noFragment } from '@/lib/http';
import settings from "@/lib/settings";

import Grid from '@/components/Grid.vue';
import RecordListItem from '@/components/RecordListItem.vue';
import KnowledgeCard from '@/views/KnowledgeCard/index.vue';
import Button from '@/components/Button.vue';

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
		loading: false,
		nextPage: null,
		Records: [],
	}),
	components: {
		Grid,
		RecordListItem,
		KnowledgeCard,
		Button,
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

			if (query.q == null || query.q == '') {
				query.q = '*';
			}

			const response = await getRelatedRecords(query, settings.apiPath);

			this.reset();

			this.stats = response.stats;
			this.search = response.search;

			if (this.queryString == null) {
				this.nextPage = response.next['@id'];
			}

			this.indexData(response.items);
		},

		async goNextPage() {
			this.loading = true;
			this.$router.replace(this.nextPage);
			const query = getQueryParams(this.nextPage.replace('/find', ''));
			const response = await getRelatedRecords(query, settings.apiPath);

			this.nextPage = response.next['@id'];
			this.indexData(response.items);
			this.loading = false;
		},

		indexData(items) {
			if (items == null) {
				return false;
			}

			items.forEach((item) => {
				if (getResources().context != null) {
					this.$data['Records'].push({
						...item,
					});
				}
			});

			this.$data['Records'] = this.$data['Records'].map(this.calculateDisplayMeta);
			const promises = this.$data['Records'].map(this.calculateFetchedMeta);

			Promise.all(promises).then((results) => {
				this.$data['Records'] = results;
			});
		},

		calculateDisplayMeta(item) {
			if (item.title != null) {
				return item;
			}

			const clone = JSON.parse(JSON.stringify(item));

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
			clone.language = getAtPath(clone, ['language', '*']).map(l => {
				return getItemLabel(l, getResources(), [], settings);
			});
			clone.contributionsCalculated = getAtPath(clone, ['contribution', '*']).map(c => {
				return {
					'role': asArray(c.role).map(r => getItemLabel(r, getResources(), [], settings)),
					'agent': getItemLabel(unwrap(c.agent), getResources(), [], settings),
					'link': getFnurgelFromUri(unwrap(asArray(c.agent).map(a => a['@id'])))
				}
			});

			return clone;
		},

		async calculateFetchedMeta(item) {
			if (item.instances != null) {
				return item;
			}

			const clone = JSON.parse(JSON.stringify(item));
			const response = await getDocument(`${noFragment(clone['@id'])}/data.jsonld`);
			if (!response.data) {
				return clone;
			}
			const split = splitJson(response.data);

			if (clone['@reverse']?.hasOwnProperty('instanceOf')) {
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

			return clone;
		},

		reset() {
			this.stats = null;
			this.search = null;
			this.Records = [];
		},
	},
	mounted() {
		this.reset();

		if (this.queryString != null) {
			this.query(this.queryString);
		} else {
			this.query();
		}

		if (this.queryString == null) {
			window.addEventListener('scroll', () => {
				const triggerPosition = this.$refs.scrollTrigger != null ?
					this.$refs.scrollTrigger.offsetTop - window.innerHeight - 250
				: null;

				if (triggerPosition == null || this.loading) {
					return false;
				}

				if (document.scrollingElement.scrollTop > triggerPosition) {
					this.loading = true;
					this.goNextPage();
				}
			});
		}
	},
	watch: {
		'$route.fullPath'() {
			if (this.loading) {
				return false;
			}

			if (this.queryString == null) {
				this.query();
			}
		},
	},
};
</script>

<template>
	<Grid :displayViewOptions="queryString == null">
		<template #top v-if="item != null && queryString == null">
			<KnowledgeCard :id="item.object['@id']" />
		</template>

		<RecordListItem
			v-for="record in Records"
			:key="record['@id']"
			:record="record"
			:displayMode="mode == 'preview' ? 'small' : null"
		/>
	</Grid>

	<div class="mt-6 flex justify-center" v-if="nextPage != null" ref="scrollTrigger">
		<Button @click="goNextPage" :disabled="loading">
			Nästa sida
		</Button>
	</div>
</template>