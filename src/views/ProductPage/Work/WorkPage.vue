<script lang="js">
import { mapState } from 'pinia';
import { useProductStore } from '@/views/ProductPage/store';
import WorkSummary from './WorkSummary.vue';
import Instance from './Instance.vue';

export default {
    name: "WorkPage",
    components: {
        'work-summary': WorkSummary,
        'instance': Instance,
    },
    computed: {
        ...mapState(useProductStore, [
            'mainEntity',
            'instanceIds',
            'instances',
            'itemSummary',
            'productType'
        ]),
    },
}
</script>

<template>
    <div class="flex gap-8 flex-col lg:flex-row">
        <div class="flex gap-x-6 flex-row">
            <div class="flex-1">
				<work-summary />
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