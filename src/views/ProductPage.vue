<script>

import { getDocument } from '@/lib/http';
import WorkSummary from "../components/WorkSummary.vue";
import Instance from "../components/Instance.vue";

export default {
    name: "ProductPage.vue",
    components: {
        'work-summary': WorkSummary,
        'instance': Instance,
    },
    data() {
        return {
            work: null,
            instances: null,
            data: null
        };
    },
    computed: {
        workId() {
            return this.$route.params.fnurgel;
        },
        instanceIds() {
            if (this.data != null && this.data.hasOwnProperty('@reverse')) {
                return this.data['@reverse']['instanceOf'];
            }
        },
        workTitle() {
            if (this.data != null && this.data.hasOwnProperty('hasTitle')) {
                return this.data['hasTitle'][0]['mainTitle'];
            }
        },
        author() {
            if (this.data != null && this.data.hasOwnProperty('hasTitle')) {
                return '';
            }
        }
    },
    mounted() {
        getDocument(`${this.workId}/data.jsonld`).then((res) => {
            this.data = res.data['@graph'][1];
        });
    }
}
</script>

<template>
    <div>
        <work-summary
                :id="workId"
                :title="workTitle"
                :author="author">
        </work-summary>
        <div v-for="id in instanceIds">
            <instance :id="id['@id']"></instance>
        </div>
        <pre>{{ this.data }}</pre>
    </div>
</template>