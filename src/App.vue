<script lang="ts">
import { mapWritableState } from 'pinia';
import { useQueryStore } from '@/stores/query';
import SearchInput from './components/SearchInput.vue';

export default {
  name: 'App',
  components: {
    SearchInput
  },
  computed: {
    ...mapWritableState(useQueryStore, ['Topic', 'GenreForm', 'Language', 'freeText']),
  },
  methods: {
    onSearch(values) {
      const store = useQueryStore();
      console.log('search value', JSON.parse(JSON.stringify(values)));
      store.$reset();
      Object.keys(values).forEach((key) => {
        this[key] = values[key];
      });
    },
  },
};
</script>

<template>
  <div class="sticky top-0 flex items-center justify-between px-12 py-4 bg-primary-white border-b border-b-secondary-grey/20">
    <div>
      <SearchInput v-on:search="onSearch" />
    </div>

    <div>
    </div>
  </div>

  <div class="px-12 my-12">
    <router-view />
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>