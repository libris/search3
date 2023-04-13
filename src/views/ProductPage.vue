<script>

import { getDocument } from '@/lib/http';

export default {
    name: "ProductPage.vue",
    data() {
        return {
            documentData: null,
            documentSummary: null
        };
    },
    computed: {
        recordId() {
            return this.$route.params.fnurgel;
        },
    },
    mounted() {
        getDocument(`${this.recordId}/data.jsonld?embellished=false`).then((res) => {
            console.log('getDocument', res);
            this.documentData = res.data['@graph'][0];
            this.documentSummary = res.data['@graph'][1];
        });
    }
}
</script>

<template>
<div>
    {{this.documentData}}
</div>
</template>