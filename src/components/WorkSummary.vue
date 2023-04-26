<script lang="ts">
import { mapState } from "pinia";
import { useProductStore } from "@/views/ProductPage/store";
import { getItemLabel } from "@/lxljs/display";
import { getResources } from "@/lib/resources";
import settings from '@/lib/settings';

export default {
    name: "WorkSummary",
    props: {
        workData: {
            type: Object,
            default: null
        },
    },
    computed: {
        ...mapState(useProductStore, ['quoted', 'workCard']),
        contributions() {
            if (this.workCard != null) {
                return this.workCard['contribution'];
            }
        },
        titles() {
            if (this.workCard != null) {
                return this.workCard['hasTitle'];
            }
        },
        genreForm() {
            if (this.workCard != null) {
                return this.workCard['genreForm'];
            }
        },
        subjects() {
            if (this.workCard != null) {
                return this.workCard['subject'];
            }
        },
        languages() {
            if (this.workCard != null) {
                return this.workCard['language'];
            }
        },
        summary() {
            if (this.workData != null && this.workData.hasOwnProperty('summary'))  {
                return getItemLabel(this.workData.summary[0], getResources(), this.quoted, settings);
            }
        }

    }
}
</script>

<template>
    <div>
        <div class="flex flex-wrap mt-2 gap-1 py-3">
            <strong v-for="title in titles">
                {{ title }}
            </strong>
            <div class="rounded-full max-h-6 text-xs px-2 py-1 bg-signal-yellow text-primary-white"
                 v-for="language in languages">
                {{ language }}
            </div>
        </div>
        <div v-for="contribution in contributions">
            {{ contribution }}
        </div>

        <div class="flex flex-wrap mt-2 gap-1">
            <div class="rounded-full text-xs px-2 py-1 bg-secondary-turquoise text-primary-white"
                 v-for="gf in genreForm">
                {{ gf }}
            </div>
        </div>
        <div class="flex flex-wrap mt-2 gap-1">
        <div class="rounded-full text-xs px-2 py-1 bg-primary-orange text-primary-white"
                 v-for="subject in subjects">
                {{ subject }}
            </div>
        </div>
        <div class="max-w-2xl py-3">
            {{ summary }}
        </div>
    </div>
</template>
