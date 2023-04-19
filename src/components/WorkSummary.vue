<script lang="js">
import { mapState } from "pinia";
import { useProductStore } from "@/views/ProductPage/store";

export default {
    name: "WorkSummary",
    props: {
        workData: {
            type: Object,
            default: null
        },
    },
    computed: {
        ...mapState(useProductStore, ['workCard']),
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

    }
}
</script>

<template>
    <div>
    </div>
    <div>
        <div v-for="title in titles">
            {{ title }}
        </div>
        <div v-for="contribution in contributions">
            {{ contribution }}
        </div>
        <div v-for="gf in genreForm">
            {{ gf }}
        </div>
    </div>
</template>
