<script lang="ts">
import { PropType } from 'vue';
import { mapWritableState } from 'pinia';
import { useSearchResults } from './store';
import { getResources } from "@/lib/resources";
import { getQueryParams, getRelatedRecords, buildQueryString } from '@/lib/http';
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

			if (this.queryString == null && response.next != null) {
				this.nextPage = response.next['@id'];
			} else {
				this.nextPage = null;
			}

			this.indexData(response.items);
		},

		async goNextPage() {
			this.loading = true;
			this.$router.replace(this.nextPage);
			const query = getQueryParams(this.nextPage.replace('/find', ''));
			const response = await getRelatedRecords(query, settings.apiPath);

			if (response.next['@id'] != null) {
				this.nextPage = response.next['@id'];
			} else {
				this.nextPage = null;
			}

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
		},

		reset() {
			this.stats = null;
			this.search = null;
			this.Records = [];
		},
	},
	async mounted() {
		this.reset();

		const queryParams = getQueryParams();
		if (queryParams['_offset'] != null) {
			const offset = parseInt(queryParams['_offset']);
			const limit = parseInt(queryParams['_limit'] ?? 10);

			delete queryParams['_offset'];
			queryParams['_limit'] = ((offset / limit) + 1) * limit;
			await this.query(buildQueryString(queryParams));

			if (localStorage.getItem('scroll-' + window.location.href) != null) {
				document.documentElement.scrollTo(0, parseInt(localStorage.getItem('scroll-' + window.location.href)));
			}

			if (this.nextPage != null) {
				// Update link for next page to have the same limit as the current url parameter
				const next = getQueryParams(this.nextPage);
				next['_limit'] = limit;
				this.nextPage = decodeURIComponent(buildQueryString(next));
			}
		} else {
			if (this.queryString != null) {
				this.query(this.queryString);
			} else {
				this.query();
			}
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

	<div class="mt-8 flex justify-center" v-if="nextPage != null" ref="scrollTrigger">
		<Button @click="goNextPage" :disabled="loading">
			Nästa sida
		</Button>
	</div>
</template>