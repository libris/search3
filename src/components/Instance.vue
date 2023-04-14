
<script>
export default {
    name: "Instance",
    props: {
        id: {
            type: [String, Object],
            default: null
        }
    },
    data() {
        return {
            type: null
        }
    }
}
</script>
<template>
  <div> instans-id: {{ id }} </div>
</template>

