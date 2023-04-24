<script lang="ts">
export default {
	name: 'Footer',
};
</script>

<template>
	<div class="flex px-12 py-8 bg-primary-white border-t border-t-secondary-grey/10">
		<div class="w-1/5 flex items-center flex-col">
			<img src="/kb_logo_black.svg" class="h-[75px] mb-3" alt="Kungliga bibliotekets logotyp" />

			<router-link to="#" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
				Kungliga biblioteket
			</router-link>
		</div>

		<div class="flex w-4/5">
			<div class="w-1/4 flex flex-col">
				<h4 class="text-md font-semibold mb-2">Om Libris</h4>

				<router-link to="#" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
					Sekretess
				</router-link>
			</div>

			<div class="w-1/4 flex flex-col">
				<h4 class="text-md font-semibold mb-2">Hjälp</h4>

				<router-link to="#" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
					Kontakt
				</router-link>

				<router-link to="#" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
					Bibblan svarar
				</router-link>

				<router-link to="#" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
					Teknik och format
				</router-link>
			</div>

			<div class="w-1/4 flex flex-col">
				<h4 class="text-md font-semibold mb-2">Libris söktjänster</h4>

				<a href="https://swepub.kb.se/" target="_blank" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
					SwePub
				</a>

				<a href="https://uppsok.libris.kb.se/sru/uppsok" target="_blank" class="text-secondary-turquoise hover:underline hover:decoration-secondary-darker-turquoise hover:text-secondary-darker-turquoise">
					Uppsök
				</a>
			</div>
		</div>
	</div>
</template>