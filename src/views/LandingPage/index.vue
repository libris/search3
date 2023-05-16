<script lang="ts">
import SearchInput from '@/components/SearchInput.vue';
export default {
	name: 'LandingPage',
	components: {
		SearchInput,
	},
	methods: {
		onSearch(values) {
			this.$router.push({ path: '/find', query: values });
		},
	},
};
</script>

<template>
	<div class="h-[45vh] bg-primary-white -my-12 -mx-12 flex flex-col items-center justify-center text-left">
		<div>
			<h1 class="text-3xl">Libris Webbsök 4</h1>
		</div>

		<div className="mt-6">
			<SearchInput v-on:search="onSearch" />
		</div>
	</div>
</template>