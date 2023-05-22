<script lang="ts">
import SearchInput from '@/components/SearchInput.vue';
import { getLabelFromObject } from '@/lxljs/string';
import settings from '@/lib/settings';
import { getAssetUrl } from '@/lib/http';

export default {
	name: 'LandingPage',
	components: {
		SearchInput,
	},
	data: () => ({
		fictionCollection: null,
	}),
	methods: {
		onSearch(values) {
			this.$router.push({ path: '/find', query: values });
		},
		getItemThumbnail(item) {
			return getAssetUrl(item.image.thumbnail['@id']);
		},
	},
	async mounted() {
		this.fictionCollection = await fetch('./json/collection_fiction.json').then(async (response) => {
			const items = await response.json();
			return items.map((item) => {
				item.label = getLabelFromObject(item, settings.language);

				return item;
			});
		});
	},
};
</script>

<template>
	<div class="md:w-5/6 mx-auto">
		<div class="my-28 flex flex-col justify-center text-left">
			<div class="text-xl">
				Sök på författare, titel, ämne eller fria sökord
			</div>

			<div className="mt-6">
				<SearchInput v-on:search="onSearch" />
			</div>
		</div>

		<div>
			<div class="text-xl">
				Eller utforska några av dessa ämnen från vår katalog
			</div>

			<div class="mt-6 mb-2">
				<h2 class="text-2xl font-medium">
					Skönlitteratur
				</h2>
			</div>

			<div class="flex flex-wrap -mx-1">
				<router-link v-for="item in fictionCollection" :key="item['@id']" :to="item.first['@id']" class="block w-full md:w-1/3 p-1">
					<div class="bg-primary-white border border-secondary-grey/20 rounded-lg overflow-hidden">
						<div
							class="h-44 bg-no-repeat bg-center bg-cover"
							:style="{ backgroundImage: `url(${getItemThumbnail(item)})` }"
						/>

						<div class="p-3">
							<h3 class="text-lg">
								{{ item.label }}
							</h3>
						</div>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>