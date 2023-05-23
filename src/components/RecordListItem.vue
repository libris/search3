<template>
	<div v-if="mode === 'cards'">
		<router-link :to="this.routerPath(record['@id'])" :title="record.title" class="flex justify-center">
			<div
				class="w-32 h-52 bg-no-repeat bg-cover bg-center rounded-lg"
				:style="{ backgroundImage: 'url(' + getWorkImageUrl(record) + ')' }"
			/>
		</router-link>

		<div class="mt-2">
			<div v-if="record.language != null" class="text-secondary-grey text-xs font-semibold">
				<span v-for="language in record.language">
					{{ language }}
				</span>
			</div>

			<h3 class="font-semibold">
				<router-link :to="this.routerPath(record['@id'])" :title="record.title" class="block truncate text-ellipsis">
					{{ record.title }}
				</router-link>
			</h3>

			<strong v-if="record.originDate != null">
				&bull; {{ record.originDate }}
			</strong>
		</div>

		<div v-if="record.contributionsCalculated != null" class="text-secondary-grey mt-1">
			<div class="mt-1" v-for="c in record.contributionsCalculated">
				<router-link v-if="c.link" :to="`/${c.link}`" class="underline">{{c.agent}}</router-link>
				<span v-else>{{c.agent}}</span>
			</div>
		</div>

		<div v-if="record.genreFormCalculated != null" class="mt-1">
			<div class="flex flex-wrap gap-2">
				<span
					class="text-xs text-secondary-turquoise"
					v-for="genreForm in record.genreFormCalculated"
				>
					{{ genreForm }}
				</span>
			</div>
		</div>

		<!--
		<div class="flex flex-wrap mt-2 gap-1">
			<div
				v-if="record.language != null"
				class="rounded-full text-xs px-2 py-1 bg-signal-yellow text-primary-white"
			>
				{{ 'record.language.label' }}
			</div>
		</div>
		-->
	</div>

	<Card v-if="mode === 'list'" :image-url="getWorkImageUrl(record)">
		<router-link :to="this.routerPath(record['@id'])" :title="record.title">
			<div class="flex items-center">
				<h3 class="text-xl font-semibold">
					{{ record.title }}

					<div v-if="record.language != null" class="inline text-sm text-secondary-grey">
						<span v-for="language in record.language">
							<span class="mx-1 font-bold">&bull;</span>
							{{ language }}
						</span>
					</div>
				</h3>
			</div>
		</router-link>
		<div v-if="record.contributionsCalculated != null" class="text-secondary-grey mt-1">
			<div class="mt-1" v-for="c in record.contributionsCalculated">
                <router-link v-if="c.link" :to="`/${c.link}`" class="underline">{{c.agent}}</router-link>
                <span v-else>{{c.agent}}</span>
            </div>
		</div>

		<div v-if="record.genreFormCalculated != null" class="mt-4">
			<div class="font-semibold text-secondary-turquoise">{{ getPropertyLabel('genreForm') }}</div>

			<div class="flex flex-wrap gap-2">
				<span
					class="text-sm text-secondary-turquoise"
					v-for="genreForm in record.genreFormCalculated"
				>
					{{ genreForm }}
				</span>
			</div>
		</div>

		<div v-if="record.subjectCalculated != null" class="mt-2">
			<div class="font-semibold text-secondary-turquoise">{{ getPropertyLabel('subject') }}</div>
			<div class="flex flex-wrap gap-2">
				<span
						class="text-sm text-secondary-turquoise"
						v-for="subject in record.subjectCalculated"
				>
					{{ subject }}
				</span>
			</div>
		</div>

		<template #footer>
			<div class="flex items-end justify-between border-t border-t-secondary-grey/20 pt-4">
				<div>
					<div v-if="record.holdings != null && record.holdings > 0">
						Finns på <u class="text-secondary-turquoise">{{ record.holdings }} bibliotek</u>
					</div>

					<div class="flex gap-x-2" v-if="getInstanceTypes(record).length > 0">
						<div class="rounded-md bg-secondary-grey/20 mt-2 py-2 px-4" v-for="instanceType in getInstanceTypes(record)">
							<font-awesome-icon icon="fa fa-book" class="mr-2 text-secondary-grey" />
							{{ getLabel(instanceType) }}
						</div>
					</div>
				</div>

				<div>
					<div
						class="flex items-center justify-center border border-secondary-turquoise rounded-full w-12 h-12 cursor-pointer"
						:class="{ ['text-secondary-turquoise']: !bookmarked, ['bg-secondary-turquoise text-primary-white']: bookmarked }"
						@click="toggleBookmark(record['@id'])"
					>
						<font-awesome-icon icon="fa fa-bookmark" />
					</div>
				</div>
			</div>
		</template>
	</Card>

	<Card v-if="mode === 'compactlist'" :image-url="getWorkImageUrl(record)" image-size="sm">
		<router-link :to="this.routerPath(record['@id'])" :title="record.title">
			<div class="flex items-center">
				<h3 class="text-xl font-semibold">
					{{ record.title }}

					<div v-if="record.language != null" class="inline text-sm text-secondary-grey">
						<span v-for="language in record.language">
							<span class="mx-1 font-bold">&bull;</span>
							{{ language }}
						</span>
					</div>
				</h3>
			</div>
		</router-link>

		<div v-if="record.contributionsCalculated != null" class="text-secondary-grey mt-1">
			<div class="mt-1" v-for="c in record.contributionsCalculated">
				<router-link v-if="c.link" :to="`/${c.link}`" class="underline">{{c.agent}}</router-link>
				<span v-else>{{c.agent}}</span>
			</div>
		</div>

		<div v-if="record.genreFormCalculated != null" class="mt-1">
			<div class="flex flex-wrap gap-2">
				<span
					class="text-sm text-secondary-turquoise"
					v-for="genreForm in record.genreFormCalculated"
				>
					{{ genreForm }}
				</span>
			</div>
		</div>
	</Card>

	<Card v-if="mode === 'small'" :image-url="getWorkImageUrl(record)" image-size="sm">
		<router-link :to="this.routerPath(record['@id'])" :title="record.title">
			<div class="flex items-center">
				<h3 class="text-l font-semibold">
					{{ record.title }}
				</h3>
			</div>

			<div>
				<strong v-if="record.originDate != null" class="text-sm text-secondary-grey">
					{{ record.originDate }}
					<span class="mx-1 font-bold" v-if="record.language != null">&bull;</span>
				</strong>

				<div v-if="record.language != null" class="inline text-sm text-secondary-grey">
					<span v-for="(language, index) in record.language">
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
import { mapActions } from 'pinia';
import { useBookmarksStore } from '@/stores/bookmarks';

export default {
	name: 'RecordListItem',
	props: {
		record: Object,
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
		},
		bookmarked() {
			return this.isBookmarked(this.record['@id']);
		}
	},
	methods: {
		...mapActions(useBookmarksStore, ['toggleBookmark', 'isBookmarked']),
		getPropertyLabel,
		getWorkImageUrl,
		getFnurgelFromUri,
		routerPath(id: string) {
			return `/${getFnurgelFromUri(id)}`;
		},
		getLabel(label) {
			return getLabelByLang(label, settings.language, getResources());
		},
		getInstanceTypes(record) {
			if (record.instances == null) {
				return [];
			}

			let result = [];
			record.instances.forEach((instance) => {
				if (result.indexOf(instance['@type']) == -1) {
					result.push(instance['@type']);
				}
			});

			return result;
		},
	},
};
</script>