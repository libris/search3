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
          const authorId = encodeURI(this.author.agent['@id']);
          return `?q=*&@type=Text&_limit=${getSearchParamValue('_limit')}&o=${authorId}&_sort=_sortKeyByLang.sv`;
		},
        relatedQuery() {
          // FIXME: hardcoded language sv
          const workId = encodeURI(this.mainEntity['@id']);
          return `?q=*&@type=Text&_limit=7&or-closeMatch.@id=${workId}&or-relatedTo.@id=${workId}&_sort=_sortKeyByLang.sv`;
        },
		relatedLink() {
          // FIXME: hardcoded language sv
          const workId = encodeURI(this.mainEntity['@id']);
          return `?q=*&@type=Text&_limit=${getSearchParamValue('_limit')}&or-closeMatch.@id=${workId}&or-relatedTo.@id=${workId}&_sort=_sortKeyByLang.sv`;
		},
    },
}
</script>

<template>
    <div class="flex gap-8 flex-col lg:flex-row">
        <div class="flex gap-x-6 flex-col w-full lg:w-3/5">
            <WorkSummary />

            <div class="block w-full lg:hidden mt-12">
                <h3 class="text-2xl font-semibold mb-2">
                    Tillgängliga format
                </h3>

                <div v-for="instance in instances" class="mb-2">
                    <Instance :key="instance['@id']" :instance="instance" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-x-8 gap-y-12 mt-12">
                <div v-if="author != null" class="lg:w-1/2">
                    <h3 class="text-2xl font-semibold mb-2">
                        Mer av samma författare
                    </h3>

                    <Query mode="preview" :query-string="moreByAuthorQuery" :see-more-link="moreByAuthorLink" />
                </div>

                <div class="lg:w-1/2">
                    <h3 class="text-2xl font-semibold mb-2">
                        Relaterade titlar
                    </h3>

                    <Query mode="preview" :query-string="relatedQuery" :see-more-link="relatedLink" />
                </div>
            </div>
        </div>

        <div class="hidden w-2/5 lg:block">
            <h3 class="text-2xl font-semibold mb-2">
                Tillgängliga format
            </h3>

            <div v-for="instance in instances" class="mb-2">
                <Instance :key="instance['@id']" :instance="instance" />
            </div>
        </div>
    </div>
</template>