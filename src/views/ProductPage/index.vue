<script lang="js">
import { mapState, mapActions } from 'pinia';
import { useProductStore } from '@/views/ProductPage/store';
import WorkSummary from '../../components/WorkSummary.vue';
import Instance from '../../components/Instance.vue';

export default {
    name: "ProductPage.vue",
    components: {
        'work-summary': WorkSummary,
        'instance': Instance,
    },
    methods: {
        ...mapActions(useProductStore, ['getProduct']),
    },
    computed: {
        ...mapState(useProductStore, [
            'work',
            'instanceIds',
            'instances',
            'itemSummary',
            'imageUrl'
        ]),
        workId() {
            return this.$route.params.fnurgel;
        },
    },
    mounted() {
        this.getProduct(this.workId);
    },
    beforeRouteLeave() {
        const productStore = useProductStore();
        productStore.$reset();
    },
    watch: {
        workId() {
            const productStore = useProductStore();
            productStore.$reset();
            this.getProduct(this.workId);
        },
        instanceIds() {
            console.log('current data', JSON.stringify(this.instances));
        }
    }
}
</script>

<template>
    <div class="flex gap-x-6 flex-col">
        <div class="flex gap-x-6 flex-row max-w-6xl rounded py-6">
            <div class="flex-1">
                <work-summary :work-data="work"/>
            </div>
            <div>
                <img class="w-full max-w-xs" :src="imageUrl"/>
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