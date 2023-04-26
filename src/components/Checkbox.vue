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
		<input
			class="hidden opacity-0 absolute w-0 h-0"
			type="checkbox"
			:checked="isChecked"
			:value="value"
			@change="updateInput"
		/>

		<div className="`
			checkmark
			flex
			items-center
			justify-center
			relative
			h-5 w-5
			rounded-md
			border-2
			border-secondary-turquoise
			hover:border-secondary-darker-turquoise
		`" />

		<span className="inline-block ml-2">
			{{ label }}
		</span>
	</label>
</template>

<style lang="css" scoped>
.wrapper input:checked~.checkmark {
	@apply bg-secondary-turquoise;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
	content: "";
	@apply hidden;
}

/* Show the checkmark when checked */
.wrapper input:checked~.checkmark:after {
	@apply block;
}

/* Style the checkmark/indicator */
.wrapper .checkmark:after {
	position: relative;
	top: -1px;
	width: 6px;
	height: 12px;
	border: solid white;
	border-width: 0 3px 3px 0;
	-webkit-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	transform: rotate(45deg);
}
</style>
