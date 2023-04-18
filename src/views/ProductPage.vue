<script lang="js">
import { mapState, mapActions } from 'pinia';
import { useProductStore } from '@/stores/product';
import WorkSummary from "../components/WorkSummary.vue";
import Instance from "../components/Instance.vue";

export default {
    name: "ProductPage.vue",
    components: {
        'work-summary': WorkSummary,
        'instance': Instance,
    },
    data() {
        return {
            work: null,
        };
    },
    methods: {
        ...mapActions(useProductStore, ['getProduct']),
    },
    computed: {
        ...mapState(useProductStore, ['workChip', 'instanceIds', 'instances', 'itemSummary', 'imageUrl']),
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
        instanceIds() {
            console.log('current data', JSON.parse(JSON.stringify(this.instances)));
        }
    }
}
</script>

<template>
    <div class="flex gap-x-6">
        <img
            class="h-72"
            :src="imageUrl"
        />

        <div>
            <work-summary
                :id="workId"
                :chip="workChip"
            />

            <div class="mt-4">
                <div v-for="instance in instances">
                    <instance :key="instance['@id']" :instance="instance" />
                </div>
            </div>
        </div>
    </div>
</template>