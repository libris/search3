<script lang="ts">
export default {
	name: 'Card',
	props: {
		imageUrl: {
			type: String,
			default: null,
		},
		icon: {
			type: String,
			default: null,
		},
	},
};
</script>

<template>
	<div class="flex flex-col gap-y-4 border border-secondary-grey/20 rounded-lg p-4 bg-primary-white">
		<div className="flex items-start gap-x-4">
			<div
				v-if="icon != null"
				class="w-8 h-8 rounded-sm flex items-center justify-center text-sm"
				style="color: #2440bc; background: #e1e5f6;"
			>
				<font-awesome-icon :icon="`fa-solid ${icon}`" />
			</div>

			<div className="flex-1">
				<slot />
			</div>

			<div v-if="imageUrl != null">
				<div
					class="w-24 h-40 bg-no-repeat bg-cover bg-center rounded-lg"
					:style="{ backgroundImage: 'url(' + imageUrl + ')' }"
				/>
			</div>
		</div>

		<slot name="footer" />
	</div>
</template>