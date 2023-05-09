<script>
import { useProductStore } from '@/views/ProductPage/store';
import { getResources } from '@/lib/resources';
import settings from '@/lib/settings';
import { getChip, getItemLabel } from '@/lxljs/display';
import { getLabelByLang } from "@/lxljs/string";
import { mapState } from 'pinia';
import { getImageUrl, getFnurgelFromUri, getAtPath } from '@/lib/item';
import { getHoldings } from "@/lib/http";
import Holding from "./Holding.vue";
import SidebarModal from '@/components/Modals/Sidebar.vue';

export default {
    name: "Instance",
    components: {
        'holding': Holding,
        SidebarModal,
    },
    data() {
        return {
            showHoldings: false,
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
                console.log('holdings', JSON.parse(JSON.stringify(this.holdings.items)));
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
    <Card :class="{ ['!border-primary-blue']: this.isExpanded }" :image-url="imageUrl" icon="fa-book">
        <router-link :to="`/${getFnurgelFromUri(this.instance['@id'])}`" class="flex items-center gap-x-2">
            <h2 class="font-semibold">
                {{ title }}
            </h2>

            <div v-for="publication in publications" class="text-secondary-grey">
                &bull;
                {{ publication.year }}
            </div>
        </router-link>

        <div>
            {{ identifiedBy }}
        </div>

        <div>
            {{ extent }}
        </div>

        <!-- <div class="text-secondary-grey mt-2">
            Finns på {{ numberOfHoldings }} bibliotek
        </div> -->

        <div class="mt-4">
            <Button @click="showHoldings = true">
                Tillgänglighet
            </Button>
        </div>

        <!-- <div class="text-secondary-grey mt-1"
            v-if="isExpanded" v-for="holding in items">
            <holding :key="holding['@id']"
                    :holding="holding"
                    :instance-id="getFnurgelFromUri(this.instance['@id'])"
            />
        </div> -->
    </Card>

    <SidebarModal v-model="showHoldings">
        <Card class="mb-8" style="background-color: #e1e5f6;" :image-url="imageUrl" icon="fa-book">
            <router-link :to="`/${getFnurgelFromUri(this.instance['@id'])}`" class="flex items-center gap-x-2">
                <h2 class="font-semibold">
                    {{ title }}
                </h2>

                <div v-for="publication in publications" class="text-secondary-grey">
                    &bull;
                    {{ publication.year }}
                </div>
            </router-link>

            <div>
                {{ identifiedBy }}
            </div>

            <div>
                {{ extent }}
            </div>
        </Card>

        <div class="text-secondary-grey font-semibold mb-2">
            Alla bibliotek
        </div>

        <div class="mb-1" v-for="holding in items">
            <holding
                :key="holding['@id']"
                :holding="holding"
                :instance-id="getFnurgelFromUri(this.instance['@id'])"
            />
        </div>
    </SidebarModal>
</template>
