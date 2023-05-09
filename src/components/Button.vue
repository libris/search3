<script lang="ts">
export default {
	name: 'Button',
};
</script>

<template>
	<button
		className="rounded-full py-2 px-4 inline-flex items-center cursor-pointer"
		style="color: #2440bc; background: #e1e5f6;"
	>
		<slot />
	</button>
</template>
