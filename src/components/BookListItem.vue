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
			<div class="flex flex-wrap gap-1">
				<span
					class="text-xs border border-secondary-turquoise text-secondary-turquoise rounded-full py-1 px-2"
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

	<div v-if="mode === 'list'" className="border border-secondary-grey/20 rounded-lg p-4 bg-primary-white">
		<div class="flex items-start gap-y-4">
			<div class="flex-1">
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

					<div class="flex flex-wrap gap-1">
						<span
							class="text-sm border border-secondary-turquoise text-secondary-turquoise rounded-full py-2 px-4"
							v-for="genreForm in book.genreFormCalculated"
						>
							{{ genreForm }}
						</span>
					</div>
				</div>
			</div>

			<div>
				<div
					class="w-24 h-40 bg-no-repeat bg-cover bg-center rounded-lg"
					:style="{ backgroundImage: 'url(' + getWorkImageUrl(book) + ')' }"
				/>
			</div>
		</div>

		<div class="flex items-end justify-between border-t border-t-secondary-grey/20 mt-4 pt-4">
			<div>
				Finns på <u class="text-secondary-turquoise">79 bibliotek</u>

				<div class="flex gap-x-2">
					<div class="rounded-md bg-secondary-grey/20 mt-2 py-2 px-4">
						<font-awesome-icon icon="fa fa-book" class="mr-2 text-secondary-grey" />
						Bok
					</div>

					<div class="rounded-md bg-secondary-grey/20 mt-2 py-2 px-4">
						<font-awesome-icon icon="fa fa-file-lines" class="mr-2 text-secondary-grey" />
						E-Bok
					</div>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-center border border-secondary-turquoise text-secondary-turquoise rounded-full w-12 h-12 cursor-pointer">
					<font-awesome-icon icon="fa fa-bookmark" />
				</div>
			</div>
		</div>
	</div>

	<div v-if="mode === 'compactlist'" className="border border-secondary-grey/20 rounded-lg p-4 bg-primary-white">
		<div class="flex items-start gap-y-4">
			<div class="flex-1">
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
					<div class="flex flex-wrap gap-1">
						<span
							class="text-sm border border-secondary-turquoise text-secondary-turquoise rounded-full py-2 px-4"
							v-for="genreForm in book.genreFormCalculated"
						>
							{{ genreForm }}
						</span>
					</div>
				</div>
			</div>

			<div>
				<div
					class="w-28 h-28 bg-no-repeat bg-cover bg-center rounded-lg"
					:style="{ backgroundImage: 'url(' + getWorkImageUrl(book) + ')' }"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { getFnurgelFromUri, getPropertyLabel, getWorkImageUrl } from '@/lib/item';
import { useDisplayPreferences } from '@/stores/displayPreferences';
import { mapState } from 'pinia';

export default {
	name: 'BookListItem',
	props: {
		book: Object,
	},
	computed: {
		...mapState(useDisplayPreferences, ['mode']),
	},
	methods: {
		getPropertyLabel,
		getWorkImageUrl,
		getFnurgelFromUri,
		routerPath(id: string) {
			return `/${getFnurgelFromUri(id)}`;
		},
	},
};
</script>