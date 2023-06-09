<template>
	<div class="relative">
		<select
			v-model="selected"
			:disabled="disabled"
			@change="handleChange"
			class="`relative
				border
				border-secondary-grey/20
				py-2 px-4
				rounded-md
				bg-primary-white
				appearance-none
			`"
			:class="class"
			v-bind="$attrs"
		>
			<slot />
		</select>

		<div class="absolute top-0 right-4 h-full text-sm flex items-center">
			<font-awesome-icon icon="fa-solid fa-chevron-down" />
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'Select',
	props: {
		modelValue: {
			type: [String, Number],
			default: '',
		},
		class: {
			type: String,
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			selected: this.modelValue,
		};
	},
	methods: {
		handleChange(event) {
			this.selected = event.target.value;
		},
	},
	watch: {
		value(newValue) {
			this.selected = newValue;
		},
	},
};
</script>