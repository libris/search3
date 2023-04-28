<template>
	<select
		v-model="selected"
		:disabled="disabled"
		@change="handleChange"
		class="`
			border
			border-secondary-grey
			py-2 px-4
			rounded-md
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
		value: {
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
			selected: this.value,
		};
	},
	methods: {
		handleChange(event) {
			this.selected = event.target.value;
			this.$emit('update:value', this.selected);
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