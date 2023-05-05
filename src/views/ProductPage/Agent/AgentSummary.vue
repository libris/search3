<script lang="ts">
import { useProductStore } from '@/views/ProductPage/store';
import { mapState } from 'pinia';
import Query from '@/views/SearchResults/Query.vue';

export default {
	name: 'PersonSummary',
	components: {
		Query,
	},
	computed: {
		...mapState(useProductStore, {
			person: 'mainEntity',
		}),
		searchValue() {
			return `?@type=Text&_limit=20&o=${this.person['@id']}`;
		},
	},
};
</script>

<template>
	<div>
        <h2 class="flex text-3xl font-semibold">
			<span>
				{{ person.givenName }} {{ person.familyName }}
			</span>

            <div class="inline-flex items-center text-sm text-secondary-grey">
				<span class="mx-1 font-bold">&bull;</span>
				{{ person.lifeSpan }}
            </div>
        </h2>
	</div>

	<div class="mt-8">
		<Query :queryString="searchValue" />
	</div>
</template>