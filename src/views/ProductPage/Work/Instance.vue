<script>
import { useProductStore } from '@/views/ProductPage/store';
import { getResources } from '@/lib/resources';
import settings from '@/lib/settings';
import { getChip, getItemLabel } from '@/lxljs/display';
import { getLabelByLang } from "@/lxljs/string";
import { mapState } from 'pinia';
import { getImageUrl, getFnurgelFromUri, getAtPath } from '@/lib/item';
import Holding from "./Holding.vue";
import { getHoldings } from "@/lib/http";

export default {
    name: "Instance",
    components: {
        'holding': Holding,
    },
    data() {
        return {
            isExpanded: false,
            holdings: null
        }
    },
    props: {
        instance: {
            type: Object,
            default: null
        }
    },
    computed: {
        ...mapState(useProductStore, ['quoted']),

        publications() {
            return getAtPath(this.instance, ['publication']).map((publication) => {
                return getChip(publication, getResources(), this.quoted, settings);
            });
        },
        title() {
            return getItemLabel(getAtPath(this.instance, ['hasTitle', 0]), getResources(), this.quoted, settings)
        },
        extent() {
            return getItemLabel(getAtPath(this.instance, ['extent', 0]), getResources(), this.quoted, settings);
        },
        imageUrl() {
            return getImageUrl(
                getFnurgelFromUri(this.instance['@id']), 
                getAtPath(this.instance, ['identifiedBy', {'@type': 'ISBN'}, 'value'])
            );
        },
        identifiedBy() {
            return getItemLabel(getAtPath(this.instance, ['identifiedBy', 0]), getResources(), this.quoted, settings);
        },
        type() {
            return getLabelByLang(this.instance['@type'], settings.language, getResources());
        },
        // holdings() {
        //     return getAtPath(this.instance, ['@reverse', 'itemOf', '*', '@id']).map((holdingId) => {
        //         return this.quoted[holdingId];
        //     });
        // },
        numberOfHoldings() {
            if (typeof this.items != 'undefined') {
                return this.items.length;
            }
        },
        items() {
            if (this.holdings != null) {
                return this.holdings.items;
            }
        },
        fnurgel() {
            return this.$route.params.fnurgel;
        },
    },
    methods: {
        getFnurgelFromUri,
        toggleExpanded() {
            this.isExpanded = !this.isExpanded;
            console.log('this.Expanded', this.isExpanded);
        },
    },
    async mounted() {
        // This is necessary unless we embellish the holdings to the work (currently we only get the holding ids).
        this.holdings = await getHoldings(this.instance['@id']).then((response) =>
            response.json()
        );

        if (this.instance != null && getFnurgelFromUri(this.instance['@id']) == this.fnurgel) {
            this.isExpanded = true;
        }
    }
}
</script>
<template>
    <router-link :to="`/${getFnurgelFromUri(this.instance['@id'])}`">
        <span :class="{ ['border-primary-blue']: this.isExpanded, ['border-secondary-grey/20'] :!this.isExpanded }" class="flex justify-between mb-4 border py-2 rounded-lg">
            <div class="pl-3">
                <h2 class="font-semibold">
                    {{ title }}
                </h2>

                <div>
                    {{ type }}
                </div>

                <div>
                    {{ identifiedBy }}
                </div>
                <div v-for="publication in publications">
                    {{ publication.year }}
                </div>
                <div>
                    {{ extent }}
                </div>
                <div class="text-secondary-grey mt-2">
                    Finns på {{ numberOfHoldings }} bibliotek
                </div>
                <div class="text-secondary-grey mt-1"
                    v-if="isExpanded" v-for="holding in items">
                    <holding :key="holding['@id']"
                            :holding="holding"
                            :instance-id="getFnurgelFromUri(this.instance['@id'])"
                    />
                </div>
            </div>
            <div class="pb-2 pt-1 pr-3 rounded-lg">
                <img :src="imageUrl" alt="">
            </div>
        </span>
    </router-link>
</template>
<style>
</style>

