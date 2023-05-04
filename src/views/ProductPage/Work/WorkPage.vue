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
            'imageUrl',
            'productType'
        ]),
    },
}
</script>

<template>
    <div class="flex gap-x-6 flex-col">
        {{ productType }}

        <div class="flex gap-x-6 flex-row max-w-6xl rounded py-6">
            <div class="flex-1">
				<work-summary />
            </div>

            <div>
                <img class="w-full max-w-xs rounded-lg" :src="imageUrl"/>
            </div>
        </div>

        <div>
            <div class="mt-4 max-w-6xl">
                <div v-for="instance in instances">
                    <instance :key="instance['@id']" :instance="instance" />
                </div>
            </div>
        </div>
    </div>
</template>