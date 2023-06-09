<template>
	<div class="block w-full">
		<slot name="top" />

		<div :class="containerClassName">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { usePreferencesStore } from '@/stores/preferences';
import { mapState } from 'pinia';

export default {
	name: 'Grid',
	props: {
		displayMode: {
			type: String,
			default: null,
		},
	},
	computed: {
		...mapState(usePreferencesStore, {
			selectedMode: 'displayMode',
		}),
		mode() {
			return this.displayMode ?? this.selectedMode
		},
		containerClassName() {
			switch (this.mode) {
				case 'cards':
					return 'grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 w-full';

				case 'list':
					return 'grid grid-cols-1 w-full';

				case 'compactlist':
					return 'grid grid-cols-1 w-full';

				case 'table':
					return 'table table-auto border-spacing-0 w-full bg-primary-white rounded-lg border border-secondary-grey/20';
			}
		},
	},
};
</script>