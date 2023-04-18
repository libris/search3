
<script>
import { useProductStore } from '@/views/ProductPage/store';
import { getResources } from '@/lib/resources';
import settings from '@/lib/settings';
import { getChip, getItemLabel } from '@/lxljs/display';
import { mapState } from 'pinia';
import { getImageUrl } from '@/lib/item';

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
        fnurgel() {
            const uriParts = this.instance['@id'].split('/');
            return uriParts[uriParts.length - 1].replaceAll('#it', '');
        },
        publications() {
            return this.instance.publication.map((publication) => {
                return getChip(publication, getResources(), this.quoted, settings);
            });
        },
        extent() {
            return getItemLabel(this.instance.extent[0], getResources(), this.quoted, settings);
        },
        imageUrl() {
            return getImageUrl(this.fnurgel, this.instance.identifiedBy[0].value);
        },
    },
    data() {
        return {
            type: null
        }
    },
}
</script>
<template>
    <div class="flex justify-between mb-6">
        <div>
            <router-link :to="`/${this.fnurgel}`" v-for="publication in publications" class="mt-4">
                {{ publication.year }} &bull; {{ publication.agent }}
            </router-link>

            <div>
                {{ extent }}
            </div>
        </div>

        <div>
            <img :src="imageUrl" alt="">
        </div>
    </div>
</template>

