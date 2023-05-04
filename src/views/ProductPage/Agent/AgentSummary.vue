<script lang="ts">
import { getResources } from '@/lib/resources';
import settings from '@/lib/settings';
import { useProductStore } from '@/views/ProductPage/store';
import { mapState } from 'pinia';

export default {
	name: 'PersonSummary',
	computed: {
		...mapState(useProductStore, {
			person: 'mainEntity',
		}),
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
</template>