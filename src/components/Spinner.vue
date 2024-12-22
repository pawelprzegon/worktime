<script setup>

defineProps({
  width: {
    type: Number,
    default: 50
  },
  height: {
    type: Number,
    default: 50
  }
})

</script>

<template>
  <div class="fixed z-50">
    <div
      class='border-4 border-t-beb border-third rounded-full animate-spin top-5'
      :style="{ width: `${width}px`, height: `${height}px` }"
    ></div>
  </div>
</template>

<style scoped>

</style>