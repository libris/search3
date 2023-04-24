
<script>
import { getItemLabel } from "@/lxljs/display";
import { getResources } from "@/lib/resources";
import settings from "@/lib/settings";
import { mapState } from "pinia";
import { useProductStore } from "@/views/WorkPage/store";


export default {
    name: "Holding",
    props: {
        holding: {
            type: Object,
            default: null
        }
    },
    computed: {
        ...mapState(useProductStore, ['quoted']),
        heldBy() {
            return this.holding['heldBy'];
        },
        library() {
            return getItemLabel(this.heldBy, getResources(), this.quoted, settings);
        }
    }
}
</script>
<template>
    <div>
        {{ this.library }}
    </div>
</template>

