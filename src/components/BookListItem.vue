<template>
	<div v-if="mode === 'cards'">
		<router-link :to="this.routerPath(book['@id'])" :title="book.title" class="flex justify-center">
			<div
				class="w-32 h-52 bg-no-repeat bg-cover bg-center rounded-lg"
				:style="{ backgroundImage: 'url(' + getWorkImageUrl(book) + ')' }"
			/>
		</router-link>

		<div class="mt-2">
			<div v-if="book.language != null" class="text-secondary-grey text-xs font-semibold">
				<span v-for="language in book.language">
					{{ language }}
				</span>
			</div>

			<h3 class="font-semibold">
				<router-link :to="this.routerPath(book['@id'])" :title="book.title" class="block truncate text-ellipsis">
					{{ book.title }}
				</router-link>
			</h3>

			<strong v-if="book.originDate != null">
				&bull; {{ book.originDate }}
			</strong>
		</div>

		<div v-if="book.contribution != null" class="text-secondary-grey mt-1">
			<span v-for="contributor in book.contribution">
				{{ contributor }}
			</span>
		</div>

		<div v-if="book.genreFormCalculated != null" class="mt-1">
			<div class="flex flex-wrap gap-2">
				<span
					class="text-xs text-secondary-turquoise"
					v-for="genreForm in book.genreFormCalculated"
				>
					{{ genreForm }}
				</span>
			</div>
		</div>

		<!--
		<div class="flex flex-wrap mt-2 gap-1">
			<div
				v-if="book.language != null"
				class="rounded-full text-xs px-2 py-1 bg-signal-yellow text-primary-white"
			>
				{{ 'book.language.label' }}
			</div>
		</div>
		-->
	</div>

	<Card v-if="mode === 'list'" :image-url="getWorkImageUrl(book)">
		<router-link :to="this.routerPath(book['@id'])" :title="book.title">
			<div class="flex items-center">
				<h3 class="text-xl font-semibold">
					{{ book.title }}

					<div v-if="book.language != null" class="inline text-sm text-secondary-grey">
						<span v-for="language in book.language">
							<span class="mx-1 font-bold">&bull;</span>
							{{ language }}
						</span>
					</div>
				</h3>
			</div>
		</router-link>

		<div v-if="book.contribution != null" class="text-secondary-grey mt-1">
			<span v-for="contributor in book.contribution">
				{{ contributor }}
			</span>
		</div>

		<div v-if="book.genreFormCalculated != null" class="mt-4">
			<div class="font-semibold text-secondary-turquoise">{{ getPropertyLabel('genreForm') }}</div>

			<div class="flex flex-wrap gap-2">
				<span
					class="text-sm text-secondary-turquoise"
					v-for="genreForm in book.genreFormCalculated"
				>
					{{ genreForm }}
				</span>
			</div>
		</div>

		<div v-if="book.subjectCalculated != null" class="mt-2">
			<div class="font-semibold text-secondary-turquoise">{{ getPropertyLabel('subject') }}</div>
			<div class="flex flex-wrap gap-2">
				<span
						class="text-sm text-secondary-turquoise"
						v-for="subject in book.subjectCalculated"
				>
					{{ subject }}
				</span>
			</div>
		</div>

		<template #footer>
			<div class="flex items-end justify-between border-t border-t-secondary-grey/20 pt-4">
				<div>
					<div v-if="book.holdings != null && book.holdings > 0">
						Finns på <u class="text-secondary-turquoise">{{ book.holdings }} bibliotek</u>
					</div>

					<div class="flex gap-x-2" v-if="getInstanceTypes(book).length > 0">
						<div class="rounded-md bg-secondary-grey/20 mt-2 py-2 px-4" v-for="instanceType in getInstanceTypes(book)">
							<font-awesome-icon icon="fa fa-book" class="mr-2 text-secondary-grey" />
							{{ getLabel(instanceType) }}
						</div>
					</div>
				</div>

				<div>
					<div class="flex items-center justify-center border border-secondary-turquoise text-secondary-turquoise rounded-full w-12 h-12 cursor-pointer">
						<font-awesome-icon icon="fa fa-bookmark" />
					</div>
				</div>
			</div>
		</template>
	</Card>

	<Card v-if="mode === 'compactlist'" :image-url="getWorkImageUrl(book)" image-size="sm">
		<router-link :to="this.routerPath(book['@id'])" :title="book.title">
			<div class="flex items-center">
				<h3 class="text-xl font-semibold">
					{{ book.title }}

					<div v-if="book.language != null" class="inline text-sm text-secondary-grey">
						<span v-for="language in book.language">
							<span class="mx-1 font-bold">&bull;</span>
							{{ language }}
						</span>
					</div>
				</h3>
			</div>
		</router-link>

		<div v-if="book.contribution != null" class="text-secondary-grey mt-1">
			<span v-for="contributor in book.contribution">
				{{ contributor }}
			</span>
		</div>

		<div v-if="book.genreFormCalculated != null" class="mt-1">
			<div class="flex flex-wrap gap-2">
				<span
					class="text-sm text-secondary-turquoise"
					v-for="genreForm in book.genreFormCalculated"
				>
					{{ genreForm }}
				</span>
			</div>
		</div>
	</Card>

	<Card v-if="mode === 'small'" :image-url="getWorkImageUrl(book)" image-size="sm">
		<router-link :to="this.routerPath(book['@id'])" :title="book.title">
			<div class="flex items-center">
				<h3 class="text-xl font-semibold">
					{{ book.title }}
				</h3>
			</div>

			<div>
				<strong v-if="book.originDate != null" class="text-sm text-secondary-grey">
					{{ book.originDate }}
					<span class="mx-1 font-bold" v-if="book.language != null">&bull;</span>
				</strong>

				<div v-if="book.language != null" class="inline text-sm text-secondary-grey">
					<span v-for="(language, index) in book.language">
						<span class="mx-1 font-bold" v-if="index > 0">&bull;</span>
						{{ language }}
					</span>
				</div>
			</div>
		</router-link>
	</Card>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { getFnurgelFromUri, getPropertyLabel, getWorkImageUrl } from '@/lib/item';
import { useDisplayPreferences } from '@/stores/displayPreferences';
import { mapState } from 'pinia';
import { getLabelByLang } from '@/lxljs/string';
import { getResources } from '@/lib/resources';
import Card from './Card.vue';
import settings from '@/lib/settings';

export default {
	name: 'BookListItem',
	props: {
		book: Object,
		displayMode: {
			type: String as PropType<'small' | 'cards' | 'list' | 'compactlist'>,
			default: null,
		},
	},
	components: {
		Card,
	},
	computed: {
		...mapState(useDisplayPreferences, {
			selectedMode: 'mode',
		}),
		mode() {
			if (this.displayMode != null) {
				return this.displayMode;
			}

			return this.selectedMode;
		}
	},
	methods: {
		getPropertyLabel,
		getWorkImageUrl,
		getFnurgelFromUri,
		routerPath(id: string) {
			return `/${getFnurgelFromUri(id)}`;
		},
		getLabel(label) {
			return getLabelByLang(label, settings.language, getResources());
		},
		getInstanceTypes(book) {
			if (book.instances == null) {
				return [];
			}

			let result = [];
			book.instances.forEach((instance) => {
				if (result.indexOf(instance['@type']) == -1) {
					result.push(instance['@type']);
				}
			});

			return result;
		},
	},
};
</script>