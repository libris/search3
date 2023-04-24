<script lang="ts">
import { mapState } from 'pinia';
import { useContextStore } from './stores/context';
import { useDisplayStore } from './stores/display';
import { useI18nStore } from './stores/i18n';
import { useVocabStore } from './stores/vocab';
import { useLoaderStore } from '@/stores/loader';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
	name: 'App',
	components: {
		Header,
		Footer,
	},
	computed: {
		...mapState(useLoaderStore, ['isLoading']),
	},
	mounted() {
		useContextStore();
		useDisplayStore();
		useI18nStore();
		useVocabStore();
	},
};
</script>

<template>
	<div>
		<Header />

		<div class="px-12 my-12">
			<div className="text-center text-secondary-grey" v-if="isLoading">
				Laddar
			</div>

			<router-view v-if="!isLoading" />
		</div>
	</div>

	<Footer />
</template>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>