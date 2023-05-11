<script lang="ts">
import { getItemLabel } from '@/lxljs/display';
import { getResources } from '@/lib/resources';
import settings from '@/lib/settings';

export default {
	name: 'Card2',
	methods: {getItemLabel},
	props: {
		data: {
			type: Object,
			default: null,
		},
	},
	computed: {
		label() {
			return getItemLabel(
					this.data,
					getResources(),
					null,
					settings,
			);
		},
	},
};
</script>

<template>
	<div class="mb-8 flex flex-col gap-y-4 border border-secondary-grey/20 rounded-lg p-4 bg-primary-white">
		<div className="flex items-start gap-x-4">
			{{ label }}
			<div className="flex-1">
				<slot />
			</div>

		</div>

		<slot name="footer" />
	</div>
</template>