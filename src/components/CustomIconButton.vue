<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '10'
  },
  height: {
    type: String,
    default: '10'
  }
})
</script>

<template>
  <img
      :class="
        `h-${props.height} w-${props.width}
        p-1 m-auto
        grayscale
        hover:grayscale-0 hover:cursor-pointer`
      "
       :src="`src/assets/img/${props.icon}`" alt="ico-button" />
</template>

<style scoped>
</style>
