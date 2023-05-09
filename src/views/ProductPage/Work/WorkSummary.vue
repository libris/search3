<script lang="ts">
import { mapState } from "pinia";
import { useProductStore } from "@/views/ProductPage/store";
import { getItemLabel } from "@/lxljs/display";
import { getResources } from "@/lib/resources";
import settings from '@/lib/settings';
import {getAtPath} from "@/lib/item";
import { getPropertyLabel } from "@/lib/item";

export default {
    name: "WorkSummary",
    computed: {
		...mapState(useProductStore, {
			workData: 'mainEntity',
		}),
        ...mapState(useProductStore, ['quoted', 'workCard', 'contributions', 'imageUrl']),
        contribution() {
            console.log('contributions', JSON.parse(JSON.stringify(this.contributions)));
            return this.contributions;
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
        gfLabel() {
          return getPropertyLabel('genreForm');
        },
        subjects() {
            if (this.workCard != null) {
                return this.workCard['subject'];
            }
        },
        subjectLabel() {
            return getPropertyLabel('subject');
        },
        classifications() {
            if (this.workCard != null) {
                return this.workCard['classification'];
            }
        },
        languages() {
            if (this.workCard != null) {
                return this.workCard['language'];
            }
        },
        summary() {
            if (this.workData != null && this.workData.hasOwnProperty('summary')) {
                return getItemLabel(this.workData.summary[0], getResources(), this.quoted, settings);
            }
        }
    },
}
</script>

<template>
    <Card :image-url="imageUrl" image-size="lg" class="w-full h-min">
        <h2 v-for="title in titles" class="text-3xl font-semibold">
            {{ title }}
        </h2>

        <div class="mt-2">
            <span v-if="languages != null" v-for="language in languages" class="text-secondary-grey text-base">
                {{ language }}
            </span>

            <div class="mt-1" v-for="c in contribution">
                <a v-if="c.link" :href="`/${c.link}`" class="underline">{{c.agent}}</a>
                <span v-else>{{c.agent}}</span>
                <span class="text-secondary-grey">
                    &bull; {{c.role.join(', ')}}
                </span>
            </div>
        </div>

        <div v-if="genreForm" class="font-semibold text-secondary-turquoise mt-3">
            {{ gfLabel }}
        </div>

        <div class="flex flex-wrap mt-1 gap-1">
            <div class="text-s border border-secondary-turquoise text-secondary-turquoise rounded-full py-0.5 px-2"
                 v-for="gf in genreForm">
                {{ gf }}
            </div>
        </div>

        <div v-if="subjects" class="font-semibold text-secondary-turquoise mt-3">{{ subjectLabel }}</div>

        <div class="flex flex-wrap mt-1 gap-1">
            <div class="text-s border border-secondary-turquoise text-secondary-turquoise rounded-full py-0.5 px-2"
                 v-for="subject in subjects">
                {{ subject }}
            </div>
        </div>

        <!--
        <div class="flex flex-wrap mt-2 gap-1">
            <div class="rounded-full text-xs px-2 py-1 bg-primary-green text-primary-white"
                 v-for="classification in classifications">
                {{ classification }}
            </div>
        </div>
        -->

        <div class="max-w-2xl py-3">
            {{ summary }}
        </div>
    </Card>
</template>
