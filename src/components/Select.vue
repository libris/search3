<template>
	<select
		v-bind="[$props, $attrs]"
		class="`
			border
			border-secondary-grey
			py-2 px-4
			rounded-md
			bg-primary-white
		`"
	>
		<slot />
	</select>
</template>

<script lang="ts">
export default {
	name: 'Select',
};
</script>