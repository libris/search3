<template>
	<select
		v-model="selected"
		:disabled="disabled"
		@change="handleChange"
		class="`
			border
			border-secondary-grey
			py-2 px-4
			rounded-sm
			bg-primary-white
		`"
		:class="class"
	>
		<slot />
	</select>
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
			this.$emit('update:modelValue', this.selected);
			this.$emit('change', this.selected);
		},
	},
	watch: {
		value(newValue) {
			this.selected = newValue;
		},
	},
};
</script>