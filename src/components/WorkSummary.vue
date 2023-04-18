<script lang="js">
export default {
    name: "WorkSummary.vue",
    props: {
        id: {
         type: String,
         default: null
        },
        chip: {
            type: Object,
            default: null,
        },
        summary: {
            type: String,
            default: null,
        },
        language: {
            type: String,
            default: null,
        },
        classification: {
            type: String,
            default: null,
        }
    },
    computed: {
        imageUrl() {
            return `https://xinfo.libris.kb.se/xinfo/xinfo?type=record&identifier=libris-bib:${this.id},isbn:${this.instanceIsbn}`
        },
        author() {
            if (this.chip != null) {
                return this.chip['contribution'];
            }
        },
        title() {
            if (this.chip != null) {
                return this.chip['hasTitle'];
            }
        }
    }
}
</script>

<template>
    <div>
        {{ this.title }} av {{ this.author }}
    </div>
</template>
