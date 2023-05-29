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
import Expandable from '@/components/Expandable.vue';

export default {
    name: "Instance",
    components: {
        Holding,
        SidebarModal,
        Expandable,
    },
    data() {
        return {
            showHoldings: false,
            isExpanded: false,
            holdings: null,
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
        dimensions() {
            return getItemLabel(getAtPath(this.instance, ['hasDimensions']), getResources(), this.quoted, settings)
        },
        responsibilityStatement() {
          const r = getItemLabel(getAtPath(this.instance, ['responsibilityStatement']), getResources(), this.quoted, settings)
          return r ? `/ ${r}` : ''
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
        isSelected() {
            if (this.instance != null && getFnurgelFromUri(this.instance['@id']) == this.fnurgel) {
                return true;
            }

            return false;
        },
    },
    methods: {
        getFnurgelFromUri,
        toggleExpanded() {
            this.isExpanded = !this.isExpanded;
        },
    },
    async mounted() {
        // This is necessary unless we embellish the holdings to the work (currently we only get the holding ids).
        this.holdings = await getHoldings(this.instance['@id']).then((response) =>
            response.json()
        );
    },
}
</script>

<template>
    <Card :class="{ ['!border-primary-blue']: isSelected }" :image-url="imageUrl" image-size="sm" icon="fa-book">
        <router-link :to="`/${getFnurgelFromUri(this.instance['@id'])}`" replace class="flex items-center gap-x-2">
            <h2>
              <span class="font-semibold">{{ title }}</span> <span class="text-secondary-grey">{{ responsibilityStatement }}</span> 
            </h2>
        </router-link>

        <div v-for="publication in publications">
            {{ publication.country }} : {{ publication.agent }}, {{ publication.year }}
        </div>
      
        <div class="text-secondary-grey">
            {{ identifiedBy }}
        </div>

        <div>
            {{ extent }}{{ extent && type ? ' • '  : ''}}{{ type }}
        </div>

        <template #footer>
            <div>
                <div class="flex gap-3 items-start">
                    <Button @click="showHoldings = true">
                        Tillgänglighet
                    </Button>

                    <Button
                        @click="isExpanded = !isExpanded"
                        class="!items-start"
                        :class="{['!border-secondary-grey/20 rounded-b-none border-b-0 z-10 h-14']: isExpanded }"
                    >
                        Detaljerad info
                        <font-awesome-icon
                            icon="fa-solid fa-chevron-up"
                            class="ml-2 mt-1 transition-all duration-300"
                            :class="{['rotate-180']: !isExpanded }"
                        />
                    </Button>
                </div>

                <Expandable :show="isExpanded">
                    <div
                        class="border rounded-lg relative border-secondary-grey/20 p-4 flex flex-col gap-y-3"
                        style="background: #eaf5f6; top: -1px;"
                    >
                        <div>
                            <strong class="block text-secondary-grey font-semibold text-sm">
                                Utgivning
                            </strong>

                            <div v-for="publication in publications">
                                {{ publication.country }} &bull; {{ publication.agent }} &bull; {{ publication.year }}
                            </div>
                        </div>

                        <div>
                            <strong class="block text-secondary-grey font-semibold text-sm">
                                Mått
                            </strong>

                            <div>
                                {{ dimensions }}
                            </div>
                        </div>

                        <div>
                            <strong class="block text-secondary-grey font-semibold text-sm">
                                Omfång
                            </strong>

                            <div>
                                {{ extent }}
                            </div>
                        </div>
                    </div>
                </Expandable>
            </div>
        </template>
    </Card>

    <SidebarModal v-model="showHoldings">
        <Card class="mb-8" style="background-color: #e1e5f6;" :image-url="imageUrl" image-size="sm" icon="fa-book">
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
            <Holding
                :key="holding['@id']"
                :holding="holding"
                :instance-id="getFnurgelFromUri(this.instance['@id'])"
            />
        </div>
    </SidebarModal>
</template>
