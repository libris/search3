<script lang="ts">
import { mapState } from 'pinia';
import { useContextStore } from './stores/context';
import { useDisplayStore } from './stores/display';
import { useI18nStore } from './stores/i18n';
import { useVocabStore } from './stores/vocab';
import { useLoaderStore } from '@/stores/loader';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { ModalsContainer } from 'vue-final-modal';

export default {
	name: 'App',
	components: {
		Header,
		Footer,
		ModalsContainer,
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
	<ModalsContainer />
</template>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
	font-family: 'Open Sans';
	src: url('/fonts/OpenSans-VariableFont_wdth,wght.ttf');
	font-style: normal;
}

@font-face {
	font-family: 'Open Sans';
	src: url('/fonts/OpenSans-Italic-VariableFont_wdth,wght.ttf');
	font-style: italic;
}
</style>