<script lang="ts">
import { PropType } from 'vue';

export default {
	name: 'Card',
	props: {
		imageUrl: {
			type: String,
			default: null,
		},
		imageSize: {
			type: String as PropType<'sm' | 'md' | 'lg'>,
			default: 'md',
			validator: (value: string) => {
				return ['sm', 'md', 'lg'].includes(value);
			},
		},
		icon: {
			type: String,
			default: null,
		},
	},
	computed: {
		coverClassNames() {
			switch (this.imageSize) {
				case 'lg':
					return 'w-40 h-64';

				case 'md':
					return 'w-24 h-40';

				case 'sm':
					return 'w-16 h-24';
			}
		},
	},
};
</script>

<template>
	<div class="flex flex-col gap-y-4 border border-secondary-grey/20 border-b-0 p-4 bg-primary-white first-of-type:rounded-t-lg last-of-type:rounded-b-lg last-of-type:border-b">
		<div className="flex items-start gap-x-4">
			<div
				v-if="icon != null"
				class="w-8 h-8 rounded-sm flex items-center justify-center text-sm"
				style="color: #058194; background: rgba(5,129,148,0.07);"
			>
				<font-awesome-icon :icon="`fa-solid ${icon}`" />
			</div>

			<div className="flex-1">
				<slot />
			</div>

			<div v-if="imageUrl != null">
				<div
					class="bg-no-repeat bg-contain bg-top rounded-lg"
					:class="coverClassNames"
					:style="{ backgroundImage: 'url(' + imageUrl + ')' }"
				/>
			</div>
		</div>

		<slot name="footer" />
	</div>
</template>