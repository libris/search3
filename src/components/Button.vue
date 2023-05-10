<script lang="ts">
export default {
	name: 'Button',
};
</script>

<template>
	<button
		class="rounded-full py-2 px-4 inline-flex items-center cursor-pointer"
		style="color: #058194; background: rgba(5,129,148,0.07);"
	>
		<slot />
	</button>
</template>
