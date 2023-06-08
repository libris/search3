<template>
	<div class="flex items-center w-full justify-between mb-8">
		<div class="flex-1">
			<div v-if="totalItems != null && totalItems > 0">
				<strong>
					{{ totalItems }}
				</strong>
				{{ translatePhrase('Hits').toLowerCase() }}
			</div>
		</div>

		<div class="flex gap-x-3 items-center">
			<div
				class="cursor-pointer text-lg"
				:class="displayMode == 'cards' ? 'text-secondary-blue' : 'text-primary-black'"
				@click="setDisplayMode('cards')"
			>
				<font-awesome-icon icon="fa-solid fa-table-cells-large" />
			</div>

			<div
				class="cursor-pointer text-lg"
				:class="displayMode == 'list' ? 'text-secondary-blue' : 'text-primary-black'"
				@click="setDisplayMode('list')"
			>
				<font-awesome-icon icon="fa-solid fa-list" />
			</div>

			<div
				class="cursor-pointer text-lg"
				:class="displayMode == 'table' ? 'text-secondary-blue' : 'text-primary-black'"
				@click="setDisplayMode('table')"
			>
				<font-awesome-icon icon="fa-solid fa-table-list" />
			</div>

			<div class="ml-1">
				<Select name="sortOptions" v-model="sort" @change="onSortChange">
					<option
						v-for="option in sortOptions"
						:value="option.query.endsWith('_sortKeyByLang') ? `${option.query}.sv` : option.query"
					>
						{{ translatePhrase(option.label) }}
					</option>
				</Select>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { getSearchParamValue, getSearchParams } from '@/lib/http';
import { mapWritableState, mapState } from 'pinia';
import { useSearchResults } from '@/views/SearchResults/store';
import { usePreferencesStore } from '@/stores/preferences';
import { translatePhrase } from '@/lib/item';
import getSettings from '@/lib/settings';
import Select from './Select.vue';

interface SortOption {
	query: string;
	label: string;
};

export default {
	name: 'SearchControls',
	components: {
		Select,
	},
	data: () => ({
		sort: getSearchParamValue('_sort'),
	}),
	props: {
		queryString: {
			type: String,
		},
	},
	computed: {
		...mapWritableState(usePreferencesStore, ['displayMode']),
		...mapState(useSearchResults, ['totalItems']),
		sortOptions(): SortOption[] {
			// FIXME l8er? Or are we good using just "work"?
			return getSettings().sortOptions.Work;
		},
	},
	methods: {
		translatePhrase,
		setDisplayMode(mode: String) {
			this.displayMode = mode;
		},
		onSortChange(event) {
			this.sort = event.target.value;
			document.documentElement.scrollTo(0, 0);
			const params = getSearchParams(this.queryString);
			delete params._offset;

			this.$router.push({
				path: '/find',
				query: {
					...params,
					'_sort': this.sort,
				}
			});
		},
	},
};
</script>