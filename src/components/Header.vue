<script lang="ts">
import { mapWritableState } from 'pinia';
import { useQueryStore } from '@/stores/query';
import { useSearchResults } from '@/views/SearchResults/store';
import SearchInput from './SearchInput.vue';

export default {
	name: 'Header',
	components: {
		SearchInput,
	},
	computed: {
		...mapWritableState(useQueryStore, ['Topic', 'GenreForm', 'Language', 'q']),
	},
	methods: {
		onSearch(values) {
			const store = useQueryStore();
			const data = useSearchResults();

			store.$reset();
			Object.keys(values).forEach((key) => {
				this[key] = values[key];
			});

			data.query(values);
		},
	},
};
</script>

<template>
	<div class="sticky top-0 flex items-center justify-between px-12 py-4 bg-primary-white border-b border-b-secondary-grey/10">
		<div class="flex gap-x-8 items-center">
			<router-link to="/" title="Startsida">
				<img src="/libris_logotyp.gif" alt="Startsida" width="141" height="25" />
			</router-link>

			<SearchInput v-on:search="onSearch" />
		</div>

		<div class="hidden lg:flex gap-x-4">
			<router-link to="#" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
				Hjälp
			</router-link>

			<router-link to="#" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
				Mina bibliotek
			</router-link>

			<router-link to="#" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
				Anpassa
			</router-link>

			<router-link to="#" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
				Logga in
			</router-link>
		</div>
	</div>
</template>