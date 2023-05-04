
<script>
import { getItemLabel } from "@/lxljs/display";
import { getResources } from "@/lib/resources";
import settings from "@/lib/settings";
import { mapState } from "pinia";
import { useProductStore } from "@/views/ProductPage/store";
import { getLoanStatus } from "@/lib/item";

export default {
    name: "Holding",
    props: {
        holding: {
            type: Object,
            default: null
        },
        instanceId: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            statusIndicator: 'test'
        }
    },
    methods: {
        setLoanStatus() {
            this.statusIndicator = 'changed';
            return getLoanStatus(this.sigel, this.instanceId);
        }
    },
    computed: {
        ...mapState(useProductStore, ['quoted']),
        heldBy() {
            return this.holding['heldBy'];
        },
        library() {
            return getItemLabel(this.heldBy, getResources(), this.quoted, settings);
        },
        sigel() {
          const parts = this.heldBy['@id'].split("/");
          return parts.pop();
        }
    },
}
</script>
<template>
    <div class="flex max-w-8xl">
        <span class="flex-1">{{ this.library }}</span>
    </div>
</template>

