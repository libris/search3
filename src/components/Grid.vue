<template>
	<div class="block w-full">
		<slot name="top" />

		<div class="flex w-full justify-between mb-8" v-if="displayViewOptions">
			<div class="flex-1"></div>

			<div class="flex gap-x-3 items-center">
				<div
					class="cursor-pointer text-lg"
					:class="mode == 'cards' ? 'text-secondary-blue' : 'text-primary-black'"
					@click="setDisplayMode('cards')"
				>
					<font-awesome-icon icon="fa-solid fa-table-cells-large" />
				</div>

				<div
					class="cursor-pointer text-lg"
					:class="mode == 'list' ? 'text-secondary-blue' : 'text-primary-black'"
					@click="setDisplayMode('list')"
				>
					<font-awesome-icon icon="fa-solid fa-list" />
				</div>

				<div
					class="cursor-pointer text-lg"
					:class="mode == 'compactlist' ? 'text-secondary-blue' : 'text-primary-black'"
					@click="setDisplayMode('compactlist')"
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

		<div :class="containerClassName">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { getSearchParamValue, getSearchParams } from '@/lib/http';
import { mapWritableState } from 'pinia';
import { useDisplayPreferences } from '@/stores/displayPreferences';
import { translatePhrase } from '@/lib/item';
import settings from '@/lib/settings';
import Select from './Select.vue';

interface SortOption {
	query: string;
	label: string;
};

export default {
	name: 'Grid',
	props: {
		displayViewOptions: {
			type: Boolean,
			default: true,
		},
	},
	data: () => ({
		sort: getSearchParamValue('_sort'),
	}),
	components: {
		Select,
	},
	computed: {
		...mapWritableState(useDisplayPreferences, ['mode']),
		containerClassName() {
			switch (this.mode) {
				case 'cards':
					return 'grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 w-full';

				case 'list':
					return 'grid grid-cols-1 gap-y-6 w-full';

				case 'compactlist':
					return 'grid grid-cols-1 gap-y-2 w-full';
			}
		},
		sortOptions(): SortOption[] {
			// FIXME l8er? Or are we good using just "work"?
			return settings.sortOptions.Work;
		},
	},
	methods: {
		translatePhrase,
		setDisplayMode(mode: String) {
			this.mode = mode;
		},
		onSortChange(event) {
			this.sort = event.target.value;
			document.documentElement.scrollTo(0, 0);
			const params = getSearchParams();
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