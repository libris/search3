<template>
	<div
		v-observe-visibility="{ callback: (v) => { this.isVisible = v }, once: true }"
		class="transition-all ease-in-out duration-300"
		:class="{ 'opacity-100 scale-100': isVisible, 'opacity-0 scale-75': !isVisible }"
	>
		<div v-if="mode === 'cards' && item != null">
			<router-link :to="this.routerPath(item['@id'])" :title="title" class="flex justify-center">
				<div
					class="w-32 h-52 bg-no-repeat bg-cover bg-center rounded-lg"
					:style="{ backgroundImage: 'url(' + imageUrl + ')' }"
				/>
			</router-link>

			<div class="mt-2">
				<div v-if="language != null" class="text-secondary-grey text-xs font-semibold">
					<span v-for="lang in language">
						{{ lang }}
					</span>
				</div>

				<h3 class="font-semibold">
					<router-link :to="this.routerPath(item['@id'])" :title="title" class="block truncate text-ellipsis">
						{{ title }}
					</router-link>
				</h3>

				<strong v-if="item.originDate != null">
					&bull; {{ item.originDate }}
				</strong>
			</div>

			<div v-if="contributionsCalculated != null" class="text-secondary-grey mt-1">
				<div class="mt-1" v-for="c in contributionsCalculated">
					<router-link v-if="c.link" :to="`/${c.link}`" class="underline">{{c.agent}}</router-link>
					<span v-else>{{c.agent}}</span>
				</div>
			</div>

			<div v-if="genreFormCalculated != null" class="mt-1">
				<div class="flex flex-wrap gap-2">
					<span
						class="text-xs text-secondary-turquoise"
						v-for="genreForm in genreFormCalculated"
					>
						{{ genreForm }}
					</span>
				</div>
			</div>

			<!--
			<div class="flex flex-wrap mt-2 gap-1">
				<div
					v-if="item.language != null"
					class="rounded-full text-xs px-2 py-1 bg-signal-yellow text-primary-white"
				>
					{{ 'item.language.label' }}
				</div>
			</div>
			-->
		</div>

		<Card v-if="mode === 'list' && item != null" :image-url="imageUrl">
			<router-link :to="this.routerPath(item['@id'])" :title="title">
				<div class="flex items-center">
					<h3 class="text-xl font-semibold">
						{{ title }}

						<div v-if="language != null" class="inline text-sm text-secondary-grey">
							<span v-for="lang in language">
								<span class="mx-1 font-bold">&bull;</span>
								{{ lang }}
							</span>
						</div>
					</h3>
				</div>
			</router-link>

			<div v-if="contributionsCalculated != null" class="text-secondary-grey mt-1">
				<div class="mt-1" v-for="c in contributionsCalculated">
					<router-link v-if="c.link" :to="`/${c.link}`" class="underline">{{c.agent}}</router-link>
					<span v-else>{{c.agent}}</span>
				</div>
			</div>

			<div v-if="genreFormCalculated != null" class="mt-4">
				<div class="font-semibold text-secondary-turquoise">{{ getPropertyLabel('genreForm') }}</div>

				<div class="flex flex-wrap gap-2">
					<span
						class="text-sm text-secondary-turquoise"
						v-for="genreForm in genreFormCalculated"
					>
						{{ genreForm }}
					</span>
				</div>
			</div>

			<div v-if="subjectCalculated != null" class="mt-2">
				<div class="font-semibold text-secondary-turquoise">{{ getPropertyLabel('subject') }}</div>
				<div class="flex flex-wrap gap-2">
					<span
						class="text-sm text-secondary-turquoise"
						v-for="subject in subjectCalculated"
					>
						{{ subject }}
					</span>
				</div>
			</div>

			<template #footer>
				<div class="flex items-end justify-between border-t border-t-secondary-grey/20 pt-4">
					<div>
						<div v-if="holdings != null && holdings > 0">
							Finns på <u class="text-secondary-turquoise">{{ holdings }} bibliotek</u>
						</div>

						<div class="flex gap-x-2" v-if="getInstanceTypes().length > 0">
							<div class="rounded-md bg-secondary-grey/20 mt-2 py-2 px-4" v-for="instanceType in getInstanceTypes()">
								<font-awesome-icon icon="fa fa-book" class="mr-2 text-secondary-grey" />
								{{ getLabel(instanceType) }}
							</div>
						</div>
					</div>

					<div>
						<BookmarkButton :id="item['@id']" />
					</div>
				</div>
			</template>
		</Card>

		<Card v-if="mode === 'compactlist' && item != null" :image-url="imageUrl" image-size="sm">
			<router-link :to="this.routerPath(item['@id'])" :title="title">
				<div class="flex items-center">
					<h3 class="text-xl font-semibold">
						{{ title }}

						<div v-if="language != null" class="inline text-sm text-secondary-grey">
							<span v-for="lang in language">
								<span class="mx-1 font-bold">&bull;</span>
								{{ lang }}
							</span>
						</div>
					</h3>
				</div>
			</router-link>

			<div v-if="contributionsCalculated != null" class="text-secondary-grey mt-1">
				<div class="mt-1" v-for="c in contributionsCalculated">
					<router-link v-if="c.link" :to="`/${c.link}`" class="underline">{{c.agent}}</router-link>
					<span v-else>{{c.agent}}</span>
				</div>
			</div>

			<div v-if="genreFormCalculated != null" class="mt-1">
				<div class="flex flex-wrap gap-2">
					<span
						class="text-sm text-secondary-turquoise"
						v-for="genreForm in item.genreFormCalculated"
					>
						{{ genreForm }}
					</span>
				</div>
			</div>
		</Card>

		<Card v-if="mode === 'small' && item != null" :image-url="imageUrl" image-size="sm">
			<router-link :to="this.routerPath(item['@id'])" :title="title">
				<div class="flex items-center">
					<h3 class="text-l font-semibold">
						{{ title }}
					</h3>
				</div>

				<div>
					<strong v-if="item.originDate != null" class="text-sm text-secondary-grey">
						{{ item.originDate }}
						<span class="mx-1 font-bold" v-if="language != null">&bull;</span>
					</strong>

					<div v-if="language != null" class="inline text-sm text-secondary-grey">
						<span v-for="(lang, index) in language">
							<span class="mx-1 font-bold" v-if="index > 0">&bull;</span>
							{{ lang }}
						</span>
					</div>
				</div>
			</router-link>
		</Card>
	</div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { asArray, getAtPath, getFnurgelFromUri, getImageUrl, getPropertyLabel, unwrap } from '@/lib/item';
import { useDisplayPreferences } from '@/stores/displayPreferences';
import { mapState } from 'pinia';
import { getLabelByLang } from '@/lxljs/string';
import { getResources } from '@/lib/resources';
import settings from '@/lib/settings';
import { getDocument, noFragment } from '@/lib/http';
import { splitJson } from '@/lxljs/data';
import { getItemLabel } from '@/lxljs/display';
import { head } from 'lodash-es';

import BookmarkButton from './BookmarkButton.vue';
import Card from './Card.vue';

export default {
	name: 'RecordListItem',
	props: {
		record: {
			type: Object,
			default: null,
		},
		id: {
			type: String,
			default: null,
		},
		displayMode: {
			type: String as PropType<'small' | 'cards' | 'list' | 'compactlist'>,
			default: null,
		},
	},
	data: () => ({
		isVisible: false,
		entity: null,
		quoted: null,
		holdings: null,
		instances: null,
	}),
	components: {
		BookmarkButton,
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
		item() {
			if (this.record != null) {
				return this.record;
			}

			return this.entity;
		},
		title() {
			if (this.item == null) return null;
			return getItemLabel(this.item.hasTitle[0], getResources(), this.quoted, settings);
		},
		contributionsCalculated() {
			if (this.item == null) return null;
			return getAtPath(this.item, ['contribution', '*']).map((c) => {
				return {
					'role': asArray(c.role).map(r => getItemLabel(r, getResources(), this.quoted, settings)),
					'agent': getItemLabel(unwrap(c.agent), getResources(), this.quoted, settings),
					'link': getFnurgelFromUri(unwrap(asArray(c.agent).map(a => a['@id'])))
				}
			});
		},
		language() {
			if (this.item == null) return null;
			return getAtPath(this.item, ['language', '*']).map(l => {
				return getItemLabel(l, getResources(), this.quoted, settings);
			});
		},
		subjectCalculated() {
			if (this.item != null && this.item.subject != null && Array.isArray(this.item.subject)) {
				return this.item.subject.map((subject) => {
					return getItemLabel(subject, getResources(), this.quoted, settings);
				}).filter(label => !label.includes('{'));
			}

			return null;
		},
		genreFormCalculated() {
			if (this.item != null && this.item.genreForm != null && Array.isArray(this.item.genreForm)) {
				return this.item.genreForm.map((genre) => {
					return getItemLabel(genre, getResources(), this.quoted, settings);
				});
			}

			return null;
		},
		imageUrl() {
			if (this.instances == null) return null;

			const fnurgel = this.instances.length > 0 ? getFnurgelFromUri(head(this.instances)['@id']) : '';
			const isbns = getAtPath(this.instances, ['*', 'identifiedBy', {'@type': 'ISBN'}, 'value']);
			const isbn = isbns.length > 0 ? head(isbns) : '';
			return getImageUrl(fnurgel, isbn);
		}
	},
	methods: {
		getPropertyLabel,
		getFnurgelFromUri,
		routerPath(id: string) {
			return `/${getFnurgelFromUri(id)}`;
		},
		getLabel(label) {
			return getLabelByLang(label, settings.language, getResources());
		},
		getInstanceTypes() {
			if (this.instances == null) {
				return [];
			}

			let result = [];
			this.instances.forEach((instance) => {
				if (result.indexOf(instance['@type']) == -1) {
					result.push(instance['@type']);
				}
			});

			return result;
		},
		async calculateFetchedMeta() {
			if (this.instances != null) {
				return this.item;
			}

			const id = this.record != null ? this.record['@id'] : this.id;
			const response = await getDocument(`${noFragment(id)}/data.jsonld`);

			if (!response.data) {
				return null;
			}

			const split = splitJson(response.data);

			this.quoted = split.quoted;
			this.entity = split.mainEntity;

			if (this.item['@reverse']?.hasOwnProperty('instanceOf')) {
				const instanceIds = this.item['@reverse']['instanceOf'].map((instance) => instance['@id']);
				if (instanceIds != null) {
					this.instances = instanceIds.map((instanceId) => {
						const instance = split.quoted[instanceId];
						if (instance != null) {
							return instance;
						}
					});
				}
			}

			if (this.instances != null) {
				this.holdings = 0;
				this.instances.forEach((instance) => {
					this.holdings += getAtPath(instance, ['@reverse', 'itemOf', '*', '@id']).length;
				});
			}
		},
	},
	mounted() {
		this.calculateFetchedMeta();
	}
};
</script>