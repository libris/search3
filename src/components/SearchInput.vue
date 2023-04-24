<template>
	<div class="flex gap-x-4 items-center">
		<div class="focustrap" tabindex="0" @focusin="onInputFocus" @focusout="onInputBlur">
			<Popper
				arrow
				:show="visible"
				placement="bottom-start"
				arrow-padding="16"
			>
				<div class="search-input">
					<div class="search-input-attribute" v-for="item in attributes" v-bind:key="item['@id']">
						{{ item.prefLabel != null ? item.prefLabel : item.label }}
					</div>

					<input
						placeholder="Sök innehåll"
						type="search"
						ref="textInput"
						@keypress="onInputKeypress"
					/>
				</div>

				<template #content>
					<Attributes v-on:attribute-select="addAttribute" :attributes="attributes" />
				</template>
			</Popper>
		</div>

		<button
			class="bg-libris-green hover:bg-libris-green/80 rounded-md py-2 px-4 text-primary-white transition-colors"
			@click="submit"
		>
			Sök
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Popper from "vue3-popper";
import Attributes from './Attributes.vue';

export default defineComponent({
	components: {
		Attributes,
		Popper,
	},
	data() {
		return {
			visible: false,
			attributes: [],
		}
	},
	methods: {
		submit() {
			let searchValue = {};

			this.attributes.forEach((attribute) => {
				if (searchValue[attribute['@type']] == null) {
					searchValue[attribute['@type']] = [];
				}

				searchValue[attribute['@type']].push(attribute);
			});

			this.$emit('search', {
				...searchValue,
				q: this.$refs['textInput'].value,
			});
		},
		onInputKeypress(event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				this.submit();
			}
		},
		onInputFocus() {
			this.visible = true;
			this.$refs['textInput'].focus();
		},
		onInputBlur() {
			this.visible = false;
		},
		addAttribute(attribute) {
			const inList = this.attributes.indexOf(attribute);
			if (inList == -1) {
				this.attributes.push(attribute);
			} else {
				this.attributes.splice(inList, 1);
			}
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
	min-width: 350px;
	border: 1px solid #e4e4eb;
	border-radius: 6px;
	display: flex;
	align-items: center;
}

.search-input-attribute {
	font-size: .6rem;
	border-radius: 6px;
	padding: 4px 6px;
	background-color: blue;
	color: white;
	margin-left: 6px;
}

input[type="search"] {
	padding: .75rem 0;
	border: 0;
	border-radius: 6px;
	flex: 1;
	padding-left: 6px;
}
</style>