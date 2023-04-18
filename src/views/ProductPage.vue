<script lang="js">
import { mapState, mapActions } from 'pinia';
import { useProductStore } from '@/stores/product';
import { getItemSummary } from '@/lxljs/display';
import { getFormattedEntries } from '@/lxljs/string';
import { getResources } from '@/lib/resources';
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
        ...mapState(useProductStore, ['current', 'mainEntity', 'quoted', 'record']),
        workId() {
            return this.$route.params.fnurgel;
        },
        instanceIds() {
            if (this.mainEntity != null && this.mainEntity.hasOwnProperty('@reverse')) {
                return this.mainEntity['@reverse']['instanceOf'];
            }
        },
        workTitle() {
            if (this.mainEntity != null) {
                const resources = getResources();
                const headerList = getItemSummary(
                    this.mainEntity,
                    resources,
                    this.quoted,
                    { language: 'sv' }, // TODO: Set language
                    resources.displayGroups,
                ).header;

                const header = getFormattedEntries(
                    headerList,
                    resources.vocab,
                    'sv', // TODO: Set language
                    resources.context,
                ).join(', ');

                if (header.length > 0 && header !== '{Unknown}') {
                    return header;
                }
            }
        },
        author() {
            if (this.mainEntity != null && this.mainEntity.hasOwnProperty('hasTitle')) {
                return '';
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
            :title="workTitle"
            :author="author"
        />

        <div v-for="id in instanceIds">
            <instance :id="id['@id']"></instance>
        </div>

        <pre>{{ this.data }}</pre>
    </div>
</template>