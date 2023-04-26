<script lang="ts">
export default {
	model: {
		prop: 'modelValue',
		event: 'change'
	},
	props: {
		"value": { type: String },
		"modelValue": { type: [String, Array], default: "" },
		"label": { type: String, required: true },
		"trueValue": { default: true },
		"falseValue": { default: false }
	},
	computed: {
		isChecked() {
			if (this.modelValue instanceof Array) {
				return this.modelValue.includes(this.value)
			}
			// Note that `true-value` and `false-value` are camelCase in the JS
			return this.modelValue === this.trueValue
		}
	},
	methods: {
		updateInput(event) {
			let isChecked = event.target.checked
			if (this.modelValue instanceof Array) {
				let newValue = [...this.modelValue]
				if (isChecked) {
					newValue.push(this.value)
				} else {
					newValue.splice(newValue.indexOf(this.value), 1)
				}
				this.$emit('change', newValue)
			} else {
				this.$emit('change', isChecked ? this.trueValue : this.falseValue)
			}
		}
	}
}
</script>

<template>
	<label class="wrapper flex items-center relative cursor-pointer">
		<input class="checkbox" type="checkbox" :checked="isChecked" :value="value" @change="updateInput"/>
		<span class="checkmark" />

		<span className="inline-block ml-2">
			{{label}}
		</span>
	</label>
</template>

<style lang="css" scoped>
</style>
