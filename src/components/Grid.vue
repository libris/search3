<template>
	<div class="block w-full">
		<div class="flex w-full justify-between">
			<div class="flex-1"></div>

			<div class="flex gap-x-2">
				<div
					class="cursor-pointer"
					:class="mode == 'cards' ? 'text-secondary-blue' : 'text-primary-black'"
					@click="setDisplayMode('cards')"
				>
					Cards
				</div>

				<div
					class="cursor-pointer"
					:class="mode == 'list' ? 'text-secondary-blue' : 'text-primary-black'"
					@click="setDisplayMode('list')"
				>
					List
				</div>

				<div
					class="cursor-pointer"
					:class="mode == 'compactlist' ? 'text-secondary-blue' : 'text-primary-black'"
					@click="setDisplayMode('compactlist')"
				>
					Compact list
				</div>
			</div>
		</div>

		<div :class="containerClassNames">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { mapWritableState } from 'pinia';
import { useDisplayPreferences } from '@/stores/displayPreferences';

export default {
	name: 'Grid',
	computed: {
		...mapWritableState(useDisplayPreferences, ['mode']),
		containerClassNames() {
			switch (this.mode) {
				case 'cards':
					return 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full';

				case 'list':
					return 'grid grid-cols-1 gap-y-6 w-full';

				case 'compactlist':
					return 'grid grid-cols-1 gap-y-2 w-full';
			}
		},
	},
	methods: {
		setDisplayMode(mode: String) {
			this.mode = mode;
		},
	}
};
</script>