<script lang="js">
import { mapState, mapActions } from 'pinia';
import { useProductStore } from '@/stores/product';
import { getChip } from '@/lxljs/display';
import { getResources } from '@/lib/resources';
import settings from '@/lib/settings';
import WorkSummary from "../components/WorkSummary.vue";
import Instance from "../components/Instance.vue";
import settings from '../lib/settings';

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
        ...mapState(useProductStore, ['current', 'mainEntity', 'quoted', 'record']),
        workId() {
            return this.$route.params.fnurgel;
        },
        instanceIds() {
            if (this.mainEntity != null && this.mainEntity.hasOwnProperty('@reverse')) {
                return this.mainEntity['@reverse']['instanceOf'];
            }
        },
        workChip() {
            if (this.mainEntity != null) {
                return getChip(this.mainEntity, getResources(), this.quoted, settings);
            }
        }
    },
    mounted() {
        this.getProduct(this.$route.params.fnurgel);
    },
    beforeRouteLeave() {
        const productStore = useProductStore();
        productStore.$reset();
    },
    watch: {
        current() {
            console.log('current data', JSON.parse(JSON.stringify(this.mainEntity)));
        }
    }
}
</script>

<template>
    <div>
        <work-summary
            :id="workId"
            :chip="workChip"
        />

        <div v-for="id in instanceIds">
            <instance :id="id['@id']"></instance>
        </div>

    </div>
</template>