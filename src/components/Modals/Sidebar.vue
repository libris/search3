<script lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import { useVfm } from 'vue-final-modal';

export default {
	name: 'SidebarModal',
	components: {
		VueFinalModal,
	},
	data: () => ({
		modalId: Symbol('modalId'),
	}),
	methods: {
		closeModal() {
			const vfm = useVfm();
			vfm.close(this.modalId);
		},
	},
};
</script>

<template>
	<VueFinalModal
		:modal-id="modalId"
		class="flex justify-end items-start"
		content-class="flex flex-col p-4 bg-primary-white w-full lg:w-2/5 h-full"
	>
		<div class="flex lg:hidden justify-end mb-4 text-3xl">
			<font-awesome-icon
				icon="fa-solid fa-xmark"
				@click="closeModal"
			/>
		</div>

		<slot />
	</VueFinalModal>
</template>