<script lang="js">
import { mapState } from 'pinia';
import { useProductStore } from '@/views/ProductPage/store';
import { getSearchParamValue } from '@/lib/http';
import WorkSummary from './WorkSummary.vue';
import Instance from './Instance.vue';
import Query from '@/views/SearchResults/Query.vue';

export default {
    name: "WorkPage",
    components: {
        WorkSummary,
        Instance,
        Query,
    },
    computed: {
        ...mapState(useProductStore, [
            'mainEntity',
            'instanceIds',
            'instances',
            'itemSummary',
            'productType',
            'author'
        ]),
        moreByAuthorQuery() {
          // FIXME: hardcoded language sv
          const authorId = encodeURI(this.author.agent['@id']);
          const workId = encodeURI(this.mainEntity['@id']);
          return `?q=*&@type=Text&_limit=7&o=${authorId}&_sort=_sortKeyByLang.sv&not-@id=${workId}`;
        },
		moreByAuthorLink() {
          // FIXME: hardcoded language sv
          const authorId = encodeURIComponent(this.author.agent['@id']);
          return `/find?q=*&@type=Text&_limit=${getSearchParamValue('_limit')}&o=${authorId}&_sort=_sortKeyByLang.sv`;
		},
        relatedQuery() {
          // FIXME: hardcoded language sv
          const workId = encodeURI(this.mainEntity['@id']);
          return `?q=*&@type=Text&_limit=7&or-closeMatch.@id=${workId}&or-relatedTo.@id=${workId}&_sort=_sortKeyByLang.sv`;
        },
		relatedLink() {
          // FIXME: hardcoded language sv
          const workId = encodeURIComponent(this.mainEntity['@id']);
          return `/find?q=*&@type=Text&_limit=${getSearchParamValue('_limit')}&or-closeMatch.@id=${workId}&or-relatedTo.@id=${workId}&_sort=_sortKeyByLang.sv`;
		},
    },
}
</script>

<template>
    <div class="flex gap-5 flex-col lg:flex-row">
        <div class="w-full lg:w-9/12">
            <WorkSummary />

            <div class="mt-5">
                <h3 class="text-2xl font-semibold mb-2">
                    Tillgängliga format
                </h3>

                <div v-for="instance in instances" class="mb-2">
                    <Instance :key="instance['@id']" :instance="instance" />
                </div>
            </div>
        </div>

        <div className="w-full lg:w-3/12">
            <div v-if="author != null">
                <h3 class="text-2xl font-semibold mb-2">
                    Mer av samma författare
                </h3>

                <Query mode="preview" :query-string="moreByAuthorQuery" :see-more-link="moreByAuthorLink" />
            </div>
            <div class="mt-5">
              <h3 class="text-2xl font-semibold mb-2">
                  Relaterade titlar
              </h3>
  
              <Query mode="preview" :query-string="relatedQuery" :see-more-link="relatedLink" />
            </div>
        </div>
    </div>
</template>