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
            instances: null,
        };
    },
    methods: {
        ...mapActions(useProductStore, ['getProduct']),
    },
    computed: {
        ...mapState(useProductStore, ['workChip', 'instanceIds', 'itemSummary', 'imageUrl']),
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
        current() {
            console.log('current data', JSON.parse(JSON.stringify(this.itemSummary)));
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

            <div v-for="id in instanceIds">
                <instance :id="id['@id']"></instance>
            </div>
        </div>
    </div>
</template>