<script setup>

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  data : {
    type: String,
    required: true
  }
})
</script>

<template>
<h1 class="text-black text-3xl font-semibold dark:text-white ">{{props.label}}:<small class="ms-2 font-extrabold text-blue-500">{{props.data}}</small></h1>
</template>

<style scoped>

</style>