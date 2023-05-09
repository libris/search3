<script lang="ts">
import { VueFinalModal } from 'vue-final-modal';
export default {
	name: 'SidebarModal',
	components: {
		VueFinalModal,
	},
};
</script>

<template>
	<VueFinalModal
		class="flex justify-end items-start"
		content-class="flex flex-col max-w-xl p-4 bg-primary-white w-2/5 h-full"
	>
		<slot />
	</VueFinalModal>
</template>