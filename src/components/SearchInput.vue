<template>
	<div class="flex items-center">
		<div class="focustrap flex-1" tabindex="0" @focusin="onInputFocus" @focusout="onInputBlur">
			<Popper
				arrow
				:show="visible"
				placement="bottom-start"
				arrow-padding="16"
				class="!block w-full"
			>
				<input
					class="border border-secondary-grey/20 rounded-full py-3 px-4 w-full"
					placeholder="Skriv in sökord"
					type="search"
					ref="textInput"
					@keypress="onInputKeypress"
					v-model="q"
				/>

				<template #content>
					Inga sökförslag hittades
				</template>
			</Popper>
		</div>

		<button
			@click="submit"
			class="transition-all border border-transparent rounded-3xl py-3 px-6 inline-flex items-center cursor-pointer justify-center text-primary-white/90"
			:class="buttonClass"
			style="background: #007787;"
		>
			<font-awesome-icon icon="fa-solid fa-search" class="mr-2" />
			Sök
		</button>
	</div>
</template>

<script lang="ts">
import { getSearchParamValue, getSearchParams } from "@/lib/http";
import { defineComponent } from "vue";
import Popper from "vue3-popper";

export default defineComponent({
	components: {
		Popper,
	},
	data() {
		return {
			q: getSearchParamValue('q'),
			visible: false,
			timer: null,
		}
	},
	computed: {
		buttonClass() {
			if (window.location.pathname == '/') {
				return 'md:w-40';
			}

			return '';
		}
	},
	methods: {
		submit() {
			this.$emit('search', {
				...getSearchParams(),
				q: this.q,
			});
		},
		onInputKeypress(event) {
			clearTimeout(this.timer);

			if (event.keyCode === 13) {
				event.preventDefault();
				this.submit();
			} else {
				if (window.location.pathname === '/find') {
					this.timer = setTimeout(this.submit, 250);
				}
			}
		},
		onInputFocus() {
			this.visible = true;
			this.$refs['textInput'].focus();
		},
		onInputBlur() {
			this.visible = false;
		},
	},
});
</script>

<style>
:root {
	--popper-theme-background-color: #ffffff;
	--popper-theme-background-color-hover: #ffffff;
	--popper-theme-text-color: #333333;
	--popper-theme-border-width: 1px;
	--popper-theme-border-style: solid;
	--popper-theme-border-color: #e4e4eb;
	--popper-theme-border-radius: 6px;
	--popper-theme-padding: 1rem;
	--popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.focustrap, input[type="search"] {
	outline: none;
}
</style>
