<template>
	<div class="block w-full">
		<div class="flex w-full justify-between mb-8">
			<div class="flex-1"></div>

			<div class="flex gap-x-2">
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
					return 'grid lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8 w-full';

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