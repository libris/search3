<script lang="ts">
export default {
	name: 'Button',
};
</script>

<template>
	<button
		class="transition-all border border-transparent rounded-3xl py-2 px-4 inline-flex items-center cursor-pointer"
		style="color: #058194; background: #eaf5f6;"
	>
		<slot />
	</button>
</template>
