<script lang="ts">
import { mapState } from "pinia";
import { useProductStore } from "@/views/ProductPage/store";
import { getItemLabel } from "@/lxljs/display";
import { getResources } from "@/lib/resources";
import settings from '@/lib/settings';
import { getPropertyLabel } from "@/lib/item";
import BookmarkButton from "@/components/BookmarkButton.vue";

export default {
    name: "WorkSummary",
    components: {
        BookmarkButton,
    },
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
            'classifications',
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
        classificationLabel() {
          return getPropertyLabel('classification');
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
                <span :class="c.isPrimary ? 'font-semibold' : ''"><router-link v-if="c.link" :to="`/${c.link}`" class="underline">{{c.agent}}</router-link>
                <span v-else>{{c.agent}}</span></span>
                <span v-if="c.role.length > 0" class="text-secondary-grey"> &bull; </span>
                <span class="text-secondary-grey">{{c.role.join(', ')}}</span>
            </div>
        </div>

        <div v-if="genreForm && genreForm.length != 0" class="font-bold text-secondary-turquoise mt-3 mb-1">{{ gfLabel }}</div>

        <div v-for="(scheme, index) in gfSchemes">
            <div class="text-secondary-grey text-base font-medium">{{ scheme.scheme }}</div>

            <div class="flex flex-wrap gap-2 pb-1">
                <span v-for="gf in scheme.genreForms">
                    <router-link v-if="gf.link" :to="gf.link" class="text-s text-secondary-turquoise underline">
                        {{gf.genreForm}}
                    </router-link>
                    <span v-else class="text-s text-secondary-turquoise">{{gf.genreForm}}</span>
                </span>
            </div>
        </div>

        <div v-if="subjects && subjects.length != 0" class="font-bold text-secondary-turquoise mt-3">
            {{ subjectLabel }}
        </div>

        <div v-for="(scheme, index) in subjectSchemes">
            <span class="text-secondary-grey text-base font-medium"> {{ scheme.scheme }} </span>
            <div class="flex flex-wrap gap-2 pb-1">
              <div v-for="s in scheme.subjects">
                <router-link v-if="s.link" :to="s.link" class="text-s text-secondary-turquoise underline">{{s.subject}}</router-link>
                  <span v-else class="text-s text-secondary-turquoise">{{s.subject}}</span>
              </div>
            </div>
        </div>

        <div v-if="classifications && classifications.length != 0" class="font-bold text-secondary-turquoise mt-3">
          {{ classificationLabel }}
        </div>
        <div class="flex flex-wrap gap-2 pb-1">
          <div v-for="c in classifications">{{c}} </div>
        </div>

        <div class="max-w-2xl py-3" v-if="summary != null">
            {{ summary }}
        </div>

        <template #footer>
            <div class="flex items-end justify-end border-t border-t-secondary-grey/20 pt-4">
                <BookmarkButton :id="workData['@id']" />
            </div>
        </template>
    </Card>
</template>
