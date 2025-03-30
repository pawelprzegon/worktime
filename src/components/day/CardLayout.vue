<script setup>

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

</script>

<template>
  <div class="flex flex-col justify-between p-2 md:p-3 lg:p-4 h-full">
    <h5 class="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{{props.title}}</h5>
    <slot />
  </div>
</template>

<style scoped>

</style>