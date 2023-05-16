<script lang="ts">
export default {
	name: 'Expandable',
	props: {
		show: {
			type: Boolean,
			default: false,
		},
	},

	data: () => ({
		contentHeight: 'auto',
	}),

	methods: {
		getElementHeight(el) {
			if (el == null) return 0;
			const clone = el.cloneNode(true);
			clone.style.cssText = 'position: fixed; top: 0; left: 0; visibility: hidden; overflow: auto; pointer-events: none; height: unset; max-height: unset';
			document.body.append(clone);
			return clone.scrollHeight;
		},
		onBeforeTransition() {
			this.contentHeight = this.getElementHeight(this.$refs.innerContainer) + 'px';
		},
		onAfterTransition() {
			this.contentHeight = 'auto';
		},
	},
};
</script>

<template>
	<Transition
		name="expand"
		@before-enter="onBeforeTransition"
		@before-leave="onBeforeTransition"
		@after-enter="onAfterTransition"
		@after-leave="onAfterTransition"
	>
		<div
			class="transition-all ease-in-out"
			:style="{ height: contentHeight }"
			v-show="show"
		>
			<div ref="innerContainer">
				<slot />
			</div>
		</div>
	</Transition>
</template>

<style lang="css">
.expand-enter-from,
.expand-leave-to {
	height: 0px !important;
	opacity: 0;
}
</style>