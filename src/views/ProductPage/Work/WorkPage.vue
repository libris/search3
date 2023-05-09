<script lang="js">
import { mapState } from 'pinia';
import { useProductStore } from '@/views/ProductPage/store';
import WorkSummary from './WorkSummary.vue';
import Instance from './Instance.vue';
import Query from '@/views/SearchResults/Query.vue';

export default {
    name: "WorkPage",
    components: {
        "work-summary": WorkSummary,
        "instance": Instance,
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
    },
}
</script>

<template>
    <div class="flex gap-8 flex-col lg:flex-row">
        <div class="flex gap-x-6 flex-col w-full lg:w-3/5">
            <work-summary />

            <div className="flex gap-x-8 mt-12">
                <div v-if="author != null" class="w-1/2">
                    <h3 class="text-2xl font-semibold mb-2">
                        Mer av samma författare
                    </h3>

                    <Query mode="preview" :query-string="`?q=*&@type=Text&_limit=20&o=${author.agent['@id']}&_sort=`" />
                </div>

                <div class="w-1/2">
                    <h3 class="text-2xl font-semibold mb-2">
                        Relaterade titlar
                    </h3>
                </div>
            </div>
        </div>

        <div class="w-full lg:w-2/5">
            <h3 class="text-2xl font-semibold mb-2">
                Tillgängliga format
            </h3>

            <div v-for="instance in instances" class="mb-2">
                <instance :key="instance['@id']" :instance="instance" />
            </div>
        </div>
    </div>
</template>