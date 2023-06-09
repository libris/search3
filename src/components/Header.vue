<script lang="ts">
import { mapWritableState } from 'pinia';
import SearchInput from './SearchInput.vue';
import { getNumberOfVowels } from "@/lxljs/string";
import { usePreferencesStore } from '@/stores/preferences';
import Popper from "vue3-popper";
import { mapState } from 'pinia';
import { useI18nStore } from '@/stores/i18n';

export default {
	name: 'Header',
	components: {
		SearchInput,
		Popper,
	},
	methods: {
		onSearch(values) {
			if (window.location.pathname === '/find') {
				this.$router.replace({ path: '/find', query: values });
			} else {
				this.$router.push({ path: '/find', query: values });
			}
		},
	},
	computed: {
		...mapWritableState(usePreferencesStore, ['selectedLanguage']),
		...mapState(useI18nStore, ['availableLanguages']),
		editLink() {
			const id = this.$route.path.substring(1)
			const isFnurgel = getNumberOfVowels(id) == 0 && id.length > 14;
			return isFnurgel ? `/katalogisering/${id}` : null;
		}
	}
};
</script>

<template>
	<div class="sticky top-0 flex items-center justify-between px-6 md:px-12 bg-primary-white border-b border-b-secondary-grey/10 z-50 h-20">
		<div class="flex gap-x-8 items-center">
			<router-link to="/" title="Startsida">
				<img src="/libris_logotyp.gif" alt="Startsida" width="141" height="25" />
			</router-link>

			<SearchInput
				v-if="$route.path !== '/'"
				v-on:search="onSearch"
			/>
		</div>

		<div class="hidden lg:flex gap-x-4">
			<router-link to="/" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
				Hjälp
			</router-link>

			<router-link to="/" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
				Mina bibliotek
			</router-link>

			<router-link to="/bookmarks" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
				Mina bokmärken
			</router-link>

			<router-link to="/" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
				Logga in
			</router-link>

			<a v-if="editLink" :href="editLink" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
				<font-awesome-icon icon="fa-solid fa-pen" />
			</a>

			<Popper
				arrow
				placement="bottom-start"
				arrow-padding="16"
				:hover="true"
			>
				<div class="cursor-pointer text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
					{{ selectedLanguage }}

					<font-awesome-icon icon="fa-solid fa-chevron-down" />
				</div>

				<template #content>
					<div
						v-for="language in availableLanguages"
						@click="() => this.selectedLanguage = language"
						class="hover:bg-primary-black/10 cursor-pointer"
					>
						{{ language }}
					</div>
				</template>
			</Popper>
		</div>
	</div>
</template>