<script lang="ts">
import Facets from '@/components/Facets.vue';
import Query from './Query.vue';
import PaginationControls from '@/components/PaginationControls.vue';
import SidebarModal from '@/components/Modals/Sidebar.vue';
import SelectedFacets from '@/components/SelectedFacets.vue';

export default {
	components: {
		Facets,
		Query,
		PaginationControls,
		SidebarModal,
		SelectedFacets
	},
	data: () => ({
		facetModal: false,
	}),
	watch: {
		'$route.fullPath'() {
			document.documentElement.scrollTo(0, 0);
		},
	},
};
</script>

<template>
	<div class="flex gap-x-10">
		<div class="hidden md:block w-1/4">
			<h3 class="text-2xl text-secondary-grey font-semibold mb-2">
				Förfina urvalet
			</h3>

			<Facets />
		</div>

		<div class="w-full md:w-3/4">
			<div class="md:hidden mb-4">
				<Button @click="() => this.facetModal = !this.facetModal">
					<font-awesome-icon icon="fa-solid fa-filter" class="mr-2" />
					Visa facetter
				</Button>

				<div class="mt-4">
					<SelectedFacets />
				</div>
			</div>

			<Query />

			<div class="mt-6 pt-6 border-t border-t-secondary-grey/20">
				<PaginationControls />
			</div>
		</div>
	</div>

	<SidebarModal v-model="facetModal">
		<h3 class="text-2xl text-secondary-grey font-semibold mb-2">
			Förfina urvalet
		</h3>

		<Facets />
	</SidebarModal>
</template>