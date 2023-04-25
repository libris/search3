<script lang="ts">
export default {
	name: 'Facet',
	props: {
		facet: Object,
	},
	computed: {
		backgroundClass() {
			if (this.facet.link.indexOf('language') > -1) {
				return 'bg-signal-yellow';
			}

			if (this.facet.link.indexOf('genreForm') > -1) {
				return 'bg-secondary-turquoise';
			}

			if (this.facet.link.indexOf('contentType') > -1) {
				return 'bg-primary-orange';
			}

			return 'bg-libris-green';
		},
	},
};
</script>

<template>
	<div
		class="inline-flex rounded-full max-h-6 text-xs px-2 py-1 text-primary-white mr-1 last-of-type:mr-0 cursor-pointer"
		:class="backgroundClass"
	>
		{{ this.facet.label }}
	</div>
</template>