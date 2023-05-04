<script lang="js">
import { mapState, mapActions } from 'pinia';
import { useProductStore } from '@/views/ProductPage/store';
import WorkPage from './Work/WorkPage.vue';
import AgentSummary from './Agent/AgentSummary.vue';

export default {
    name: "ProductPage.vue",
    components: {
        'work-page': WorkPage,
        'agent-page': AgentSummary,
    },
    methods: {
        ...mapActions(useProductStore, ['getProduct']),
    },
    computed: {
        ...mapState(useProductStore, [
            'productType'
        ]),
        productId() {
            return this.$route.params.fnurgel;
        },
    },
    mounted() {
        this.getProduct(this.productId);
    },
    beforeRouteLeave() {
        const productStore = useProductStore();
        productStore.$reset();
    },
    watch: {
        productId() {
            const productStore = useProductStore();
            productStore.$reset();
            this.getProduct(this.productId);
        },
    },
}
</script>

<template>
    <component
        :is="`${productType}-page`"
    />
</template>