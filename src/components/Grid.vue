<template>
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
		<slot />
	</div>
</template>

<script lang="ts">
export default {
	name: 'Grid',
};
</script>