<script lang="ts">
import { PropType } from 'vue';
import { mapWritableState } from 'pinia';
import { useSearchResults } from './store';
import { getResources } from "@/lib/resources";
import { getQueryParams, getRelatedRecords } from '@/lib/http';
import { getSearchParamValue } from '@/lib/http';
import { translatePhrase } from '@/lib/item';
import settings from "@/lib/settings";

import Grid from '@/components/Grid.vue';
import RecordListItem from '@/components/RecordListItem.vue';
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
		Records: [],
		totalItemsCount: null,
	}),
	components: {
		Grid,
		RecordListItem,
		KnowledgeCard,
	},
	computed: {
		...mapWritableState(useSearchResults, ['stats', 'search', 'first', 'last', 'next', 'previous', 'totalItems']),
		item() {
			if (this.search != null && this.search.mapping != null) {
				return this.search.mapping.find((map) =>
					map.variable == 'o'
				);
			}

			return null;
		},
		displayAllLink() {
			if (this.queryString != null) {
				return '/find' + this.queryString.replace('_limit=3', '_limit=' + getSearchParamValue('_limit'));
			}

			return null;
		},
	},
	methods: {
		translatePhrase,
		async query(queryString) {
			const query = getQueryParams(queryString);

			if (query.q == null || query.q == '') {
				query.q = '*';
			}

			this.Records = [];
			const response = await getRelatedRecords(query, settings.apiPath);

			this.reset();

			this.stats = response.stats;
			this.search = response.search;
			this.first = response.first;
			this.last = response.last;
			this.next = response.next;
			this.previous = response.previous;
			this.totalItems = this.totalItemsCount = response.totalItems;

			this.indexData(response.items);
		},

		indexData(items) {
			if (items == null) {
				return false;
			}

			items.forEach((item) => {
				if (getResources().context != null) {
					this.$data['Records'].push(item);
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

		if (this.queryString != null) {
			this.query(this.queryString);
		} else {
			this.query();
		}
	},
	watch: {
		'$route.fullPath'() {
			if (this.queryString == null) {
				this.query();
			}
		},
	},
};
</script>

<template>
	<div class="relative" :class="{ ['max-h-[70vh] overflow-hidden']: mode == 'preview' }">
		<Grid :displayMode="mode == 'preview' ? 'compactlist' : null" :displayViewOptions="queryString == null">
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

		<div v-if="mode == 'preview' && totalItemsCount != null && totalItemsCount > 0">
			<div class="flex items-center justify-center w-full absolute bottom-0 left-0 h-28 bg-gradient-to-t from-primary-black/70">
				<RouterLink :to="displayAllLink">
					<Button>
						{{ translatePhrase('Show all') }} ({{ totalItemsCount }}st)
					</Button>
				</RouterLink>
			</div>
		</div>
	</div>
</template>