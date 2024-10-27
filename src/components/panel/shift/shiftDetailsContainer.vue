<script setup>

const props = defineProps({
  label: String,
  data: String
})

</script>

<template>

  <div class="tooltip">
    <label>{{props.label}}:</label>
    <span>{{props.data}}</span>
  </div>

</template>

<style scoped>

</style>