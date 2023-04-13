<script lang="ts">
import { mapState, mapWritableState } from 'pinia';
import { useQueryStore } from '@/stores/query';
import { useDataStore } from '@/stores/data';
import { useLoaderStore } from '@/stores/loader';
import SearchInput from './components/SearchInput.vue';
import { getDocument } from '@/lib/http';

export default {
	name: 'App',
	components: {
		SearchInput
	},
	computed: {
		...mapWritableState(useQueryStore, ['Topic', 'GenreForm', 'Language', 'q']),
		...mapState(useLoaderStore, ['isLoading']),
	},
	methods: {
		onSearch(values) {
			const store = useQueryStore();
			const data = useDataStore();
			console.log('search value', JSON.parse(JSON.stringify(values)));

			store.$reset();
			Object.keys(values).forEach((key) => {
				this[key] = values[key];
			});

			data.query(values);
		},
	},
	mounted() {
		getDocument('2jtl0svr0v89bk25/data.jsonld?lens=card').then((res) => {
			console.log('getDocument', res);
		});
	},
};
</script>

<template>
	<div class="sticky top-0 flex items-center justify-between px-12 py-4 bg-primary-white border-b border-b-secondary-grey/20">
		<div>
			<SearchInput v-on:search="onSearch" />
		</div>

		<div>
		</div>
	</div>

	<div class="px-12 my-12">
		<div className="text-center text-secondary-grey" v-if="isLoading">
			Laddar
		</div>

		<router-view v-if="!isLoading" />
	</div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>