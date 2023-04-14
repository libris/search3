<script lang="ts">
export default {
    name: "WorkSummary.vue",
    props: {
        id: {
         type: String,
         default: null
        },
        title: {
            type: String,
            default: null,
        },
        author: {
            type: String,
            default: null,
        },
        genreForm: {
            type: Array,
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
        imageUrl(id: string, isbn: string) {
            return `https://xinfo.libris.kb.se/xinfo/xinfo?type=record&identifier=libris-bib:${this.id},isbn:${this.instanceIsbn}`
        }
    }
}
</script>

<template>
    <div>
        {{ title }} av {{ author }}
    </div>
</template>
