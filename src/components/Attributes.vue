<template>
	<div class="grid grid-cols-2 gap-x-6 gap-y-10">
		<div>
			<h3 class="text-left">GenreForm</h3>

			<div class="flex flex-wrap mt-2 gap-1">
				<div
					class="rounded-full text-xs px-2 py-1 bg-secondary-turquoise text-primary-white cursor-pointer"
					:class="attributes.find((att) => att['@id'] == genre['@id']) != null ? 'opacity-100' : 'opacity-70'"
					v-for="genre in GenreForm"
					v-bind:key="genre['id']"
					@click="$emit('attributeSelect', genre)"
				>
					{{genre.prefLabel}}
				</div>
			</div>
		</div>

		<div>
			<h3>Language</h3>

			<div class="flex flex-wrap mt-2 gap-1">
				<div
					class="rounded-full text-xs px-2 py-1 bg-signal-yellow text-primary-white cursor-pointer"
					:class="attributes.find((att) => att['@id'] == language['@id']) != null ? 'opacity-100' : 'opacity-70'"
					v-for="language in Language"
					v-bind:key="language['id']"
					@click="$emit('attributeSelect', language)"
				>
					{{language.label}}
				</div>
			</div>
		</div>

		<div>
			<h3>Topic</h3>

			<div class="flex flex-wrap mt-2 gap-1">
				<div
					class="rounded-full text-xs px-2 py-1 bg-primary-orange text-primary-white cursor-pointer"
					:class="attributes.find((att) => att['@id'] == topic['@id']) != null ? 'opacity-100' : 'opacity-70'"
					v-for="topic in Topic"
					v-bind:key="topic['id']"
					@click="$emit('attributeSelect', topic)"
				>
					{{topic.prefLabel}}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { useDataStore } from '@/stores/data';

export default {
	name: 'Attributes',
	props: [
		'attributes'
	],
	computed: {
		...mapState(useDataStore, ['GenreForm', 'Language', 'Topic']),
	},
};
</script>
