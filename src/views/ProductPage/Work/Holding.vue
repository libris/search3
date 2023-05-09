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
    <Card>
        <div>{{ this.library }}</div>

        <div class="flex gap-x-2 mt-2">
            <div class="py-1 px-2 rounded-sm text-sm" style="color: #2440bc; background: #e1e5f6;">
                <font-awesome-icon icon="fa-solid fa-check" />
                Tillgänglig
            </div>

            <div class="py-1 px-2 rounded-sm text-sm" style="color: #b3401d; background: #f4e0d8;">
                <font-awesome-icon icon="fa-solid fa-xmark" />
                Utlånad
            </div>
        </div>
    </Card>
</template>
