<script setup>

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '30'
  },
  height: {
    type: String,
    default: '30'
  }
})

const icon = new URL(`../assets/img/${props.icon}`, import.meta.url).href;


</script>

<template>
  <img
      class="
      p-1 m-1
      grayscale
      hover:grayscale-0 hover:cursor-pointer
      "
      :class="`portrait-2xs:h-[${props.height}px] portrait-2xs:w-[${props.width}px]
      portrait-medium:h-[${props.height}px] portrait-medium:w-[${props.width}px]`"

      :src=icon alt="ico-button"
  />
</template>

<style scoped>
</style>
