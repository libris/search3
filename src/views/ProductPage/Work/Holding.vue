<script>
import { getItemLabel } from "@/lxljs/display";
import { getResources } from "@/lib/resources";
import settings from "@/lib/settings";
import { mapState } from "pinia";
import { useProductStore } from "@/views/ProductPage/store";
import { getLoanStatus } from "@/lib/item";
import Expandable from "@/components/Expandable.vue";

export default {
    name: "Holding",
    components: {
        Expandable,
    },
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
            statusIndicator: 'unchanged',
            available: null,
            error: false,
            expanded: false,
            items: [],
        }
    },
    methods: {
        async setLoanStatus() {
            this.statusIndicator = 'changed';
            const { item_information } = await getLoanStatus(this.sigel, this.instanceId);

            if (item_information == null || item_information.error != null) {
                this.error = true;
                return true;
            }

            this.items = item_information.items;
            let available_items = item_information.items.filter((item) =>
                this.availableStatuses.indexOf(item.Status) > -1
            );

            this.available = available_items.length > 0;
        },
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
        },
        availableStatuses() {
            return [
                'Tillgänglig',
                'Ej utlånad',
                'Available',
            ];
        },
    },
    mounted() {
        this.setLoanStatus();
    },
};
</script>

<template>
    <Card @click="expanded = !expanded" class="cursor-pointer">
        <div>{{ this.library }}</div>

        <div class="flex gap-x-2 mt-2" v-if="available != null">
            <div class="py-1 px-2 rounded-sm text-sm" style="color: #2440bc; background: #e1e5f6;" v-if="available">
                <font-awesome-icon icon="fa-solid fa-check" />
                Tillgänglig
            </div>

            <div class="py-1 px-2 rounded-sm text-sm" style="color: #b3401d; background: #f4e0d8;" v-else>
                <font-awesome-icon icon="fa-solid fa-xmark" />
                Utlånad
            </div>
        </div>

        <div v-if="error" class="text-sm">
            <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
            Lånestatus kunde inte hämtas
        </div>

        <Expandable v-show="expanded">
            <div class="flex flex-col gap-y-3 text-sm">
                <!-- <div class="flex"> WIP: add real info here
                    <div class="w-1/2">
                        <strong>
                            Adress
                        </strong>

                        <div>
                            Kulturförvaltningen<br />
                            113 80, Stockholm
                        </div>
                    </div>

                    <div class="w-1/2">
                        <strong>
                            Telefon
                        </strong>

                        <div>
                            0850830900
                        </div>
                    </div>
                </div> -->

                <table v-if="items.length > 0" class="mt-3">
                    <thead>
                        <tr class="text-left">
                            <th>Placering</th>
                            <th>Hylla</th>
                            <th>Lånepolitik</th>
                            <th>Status</th>
                            <th>Datum</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in items" :key="item.Item_No">
                            <td>
                                {{ item.location }}
                            </td>

                            <td>
                                {{ item.Call_No }}
                            </td>

                            <td>
                                {{ item.Loan_Policy }}
                            </td>

                            <td>
                                {{ item.Status }}
                            </td>

                            <td>
                                {{ item.Status_Date }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Expandable>
    </Card>
</template>
