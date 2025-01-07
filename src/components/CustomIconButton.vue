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

console.log(icon)
</script>

<template>
  <img
      class="
      p-1 m-1
      grayscale
      hover:grayscale-0 hover:cursor-pointer

      portrait-2xs:h-[30px] portrait-2xs:w-[30px]
      portrait-medium:h-[40px] portrait-medium:w-[40px]

      "

      :src=icon alt="ico-button"
  />
</template>

<style scoped>
</style>
