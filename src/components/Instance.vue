
<script>
import { useProductStore } from '@/views/WorkPage/store';
import { getResources } from '@/lib/resources';
import settings from '@/lib/settings';
import { getChip, getItemLabel } from '@/lxljs/display';
import { getLabelByLang } from "@/lxljs/string";
import { mapState } from 'pinia';
import { getImageUrl, getFnurgelFromUri } from '@/lib/item';

export default {
    name: "Instance",
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
            return getLabelByLang(
                this.instance['@type'],
                settings.language,
                getResources()
            );
        }
    },
    methods: {
        getFnurgelFromUri
    }
}
</script>
<template>
    <div class="flex justify-between mb-4 border-2 border-secondary-grey/20 py-2">
        <div class="pl-3">
            <router-link :to="`/${getFnurgelFromUri(this.instance['@id'])}`" class="mt-4 underline">
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
        </div>
        <div class="pb-2 pt-1 pr-3">
            <img :src="imageUrl" alt="">
        </div>
    </div>
</template>

