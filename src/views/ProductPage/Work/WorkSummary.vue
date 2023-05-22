<script lang="ts">
import { mapState } from "pinia";
import { useProductStore } from "@/views/ProductPage/store";
import { getItemLabel } from "@/lxljs/display";
import { getResources } from "@/lib/resources";
import settings from '@/lib/settings';
import { getPropertyLabel } from "@/lib/item";

export default {
    name: "WorkSummary",
    computed: {
		...mapState(useProductStore, {
			workData: 'mainEntity',
		}),
        ...mapState(useProductStore, ['quoted',
            'workCard',
            'contributions',
            'imageUrl',
            'subjects',
            'subjectSchemes',
            'genreForms',
            'gfSchemes']
        ),
        contribution() {
            return this.contributions;
        },
        subject() {
            return this.subjects;
        },
        genreForm() {
            return this.genreForms;
        },
        titles() {
            if (this.workCard != null) {
                return this.workCard['hasTitle'];
            }
        },
        gfLabel() {
          return getPropertyLabel('genreForm');
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

        <div v-if="genreForm && genreForm.length != 0" class="font-semibold text-secondary-turquoise mt-3">{{ gfLabel }}</div>
            <div class="mt-1.5" v-for="(scheme, index) in gfSchemes">{{ scheme.scheme }}
                <div class="flex flex-wrap gap-2 pb-2">
                    <span v-for="gf in scheme.genreForms">
                        <span class="text-s text-secondary-turquoise underline">
                            <router-link :to="gf.link">
                                {{ gf.genreForm }}
                            </router-link>
                        </span>
                    </span>
                </div>
                <div  v-if="index + 1 != gfSchemes.length" class="border-t border-t-secondary-grey/20"></div>
            </div>

        <div v-if="subjects && subjects.length != 0" class="font-semibold text-secondary-turquoise mt-3">{{ subjectLabel }}</div>
        <div class="mt-1" v-for="(scheme, index) in subjectSchemes">{{ scheme.scheme }}
            <div class="flex flex-wrap gap-2 pb-2">
                <div v-for="s in scheme.subjects">
                    <router-link :to="s.link">
                    <span
                        class="text-s text-secondary-turquoise underline">
                        {{ s.subject }}
                    </span>
                    </router-link>
                </div>
            </div>
            <div  v-if="index + 1 != subjectSchemes.length" class="border-t border-t-secondary-grey/20"></div>
        </div>
        <!--
        <div class="flex flex-wrap mt-2 gap-1">
            <div class="rounded-full text-xs px-2 py-1 bg-primary-green text-primary-white"
                 v-for="classification in classifications">
                {{ classification }}
            </div>
        </div>
        -->

        <div class="max-w-2xl py-3" v-if="summary != null">
            {{ summary }}
        </div>
    </Card>
</template>
