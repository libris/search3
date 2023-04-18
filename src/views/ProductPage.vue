<script lang="js">
import { mapState, mapActions } from 'pinia';
import { useProductStore } from '@/stores/product';
import { getChip, getItemSummary } from '@/lxljs/display';
import { getResources } from '@/lib/resources';
import { getImageUrl } from '@/lib/item';
import settings from '@/lib/settings';
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
        getImageUrl,
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
        },
        itemSummary() {
            if (this.mainEntity != null) {
                return getItemSummary(
                    this.mainEntity,
                    getResources(),
                    this.quoted,
                    settings,
                    getResources().displayGroups,
                );
            }

            return null;
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
            console.log('current data', JSON.parse(JSON.stringify(this.workChip)), this.displayObject);
        }
    }
}
</script>

<template>
    <div class="flex gap-x-6">
        <img
            class="h-72"
            :src="getImageUrl('10145888','9789185251872')"
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