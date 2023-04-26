
<script>
import { useProductStore } from '@/views/ProductPage/store';
import { getResources } from '@/lib/resources';
import settings from '@/lib/settings';
import { getChip, getItemLabel } from '@/lxljs/display';
import { getLabelByLang } from "@/lxljs/string";
import { mapState } from 'pinia';
import { getImageUrl, getFnurgelFromUri } from '@/lib/item';
import Holding from "./Holding.vue";

export default {
    name: "Instance",
    components: {
        'holding': Holding,
    },
    data() {
        return {
            isExpanded: false,
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
            return this.instance.publication.map((publication) => {
                return getChip(publication, getResources(), this.quoted, settings);
            });
        },
        title() {
            console.log('this.instance.title[0]', this.instance);
            return getItemLabel(this.instance.hasTitle[0], getResources(), this.quoted, settings)
        },
        extent() {
            return getItemLabel(this.instance.extent[0], getResources(), this.quoted, settings);
        },
        imageUrl() {
            return getImageUrl(getFnurgelFromUri(this.instance['@id']), this.instance.identifiedBy[0].value);
        },
        identifiedBy() {
            return getItemLabel(this.instance.identifiedBy[0], getResources(), this.quoted, settings);
        },
        type() {
            return getLabelByLang(this.instance['@type'], settings.language, getResources());
        },
        holdings() {
            if (this.instance.hasOwnProperty('@reverse')) {
                return this.instance['@reverse']['itemOf'].map((holdingId) => {
                        return this.quoted[holdingId['@id']];
                })
            } else {
                return [];
            }
        },
        numberOfHoldings() {
            return this.holdings.length
        },
    },
    methods: {
        getFnurgelFromUri,
        toggleExpanded() {
            this.isExpanded = !this.isExpanded;
            console.log('this.Expanded', this.isExpanded);
        },
    }
}
</script>
<template>
    <span @click="toggleExpanded" :class="{ ['border-primary-blue']: this.isExpanded, ['border-secondary-grey/20'] :!this.isExpanded }" class="flex justify-between mb-4 border py-2">
        <div class="pl-3">
            <router-link :to="`/${getFnurgelFromUri(this.instance['@id'])}`">
                {{ title }}
            </router-link>
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
            <div>
                Finns på {{ numberOfHoldings }} bibliotek
            </div>
            <div v-if="isExpanded" v-for="holding in holdings">
                <holding :key="holding['@id']" :holding="holding" />
            </div>
        </div>
        <div class="pb-2 pt-1 pr-3">
            <img :src="imageUrl" alt="">
        </div>
    </span>
</template>
<style>
</style>

