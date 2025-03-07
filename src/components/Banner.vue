<script setup>

defineProps({
  mainText: {
    type: String,
    required: false,
    default: ''
  },
  additionalText: {
    type: String,
    required: false,
    default: ''
  },
  supplementaryText: {
    type: String,
    required: false,
    default: ''
  }
})
</script>

<template>
  <h2 class="bg-red-500 text-stone-800 font-bold text-xl rounded-md p-1 text-center">
    {{ mainText }}
    <br>
    <span>{{ additionalText }} {{ supplementaryText }}</span>
  </h2>
</template>

<style scoped>
</style>
