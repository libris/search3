<template>
	<div class="flex items-center">
		<div class="focustrap" tabindex="0" @focusin="onInputFocus" @focusout="onInputBlur">
			<Popper
				arrow
				:show="visible"
				placement="bottom-start"
				arrow-padding="16"
			>
				<div class="search-input">
					<input
						placeholder=""
						type="search"
						ref="textInput"
						@keypress="onInputKeypress"
						v-model="q"
					/>
				</div>

				<template #content>
					Inga sökförslag hittades
				</template>
			</Popper>
		</div>

		<button
			class="bg-libris-green hover:bg-libris-green/80 border border-libris-green rounded-r-md py-3 px-5 text-primary-white transition-colors"
			@click="submit"
		>
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

.search-input {
	border: 1px solid #e4e4eb;
	border-top-left-radius: 6px;
	border-bottom-left-radius: 6px;
	display: flex;
	align-items: center;
}

input[type="search"] {
	padding: .75rem 0;
	border: 0;
	border-top-left-radius: 6px;
	border-bottom-left-radius: 6px;
	flex: 1;
	padding-left: 6px;
}
</style>
