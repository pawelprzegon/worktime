<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  padding: {
    type: Number,
    default: 5
  },
  margin: {
    type: Number,
    default: 5
  },
  width: {
    type: Number,
    default: 100
  },
  fontSize: {
    type: Number,
    default: 13
  },
  color: {
    type: String,
    default: null
  },
})
</script>

<template>
  <button
    :class="[
      'flex items-center justify-center cursor-pointer box-border transition-all duration-200 text-sm rounded-md',
      { 'bg-blue-500 text-white': props.isActive, 'bg-mute': !props.isActive },
      { 'hover:bg-light hover:text-black hover:border-gray-300': !props.isActive },
      'portrait-xs:w-23 portrait-xs:h-5 portrait-xs:font-xs portrait-xs:p-2 portrait-xs:m-1',
      'portrait-small:w-23 portrait-small:h-6 portrait-small:font-xs portrait-small:p-2 portrait-small:m-2',
      'portrait-medium:w-25 portrait-medium:h-7 portrait-medium:font-sm portrait-medium:p-3 portrait-medium:m-3',
      'portrait-large:w-25 portrait-large:h-7 portrait-large:font-sm portrait-large:p-3 portrait-large:m-3',
      'portrait-xl:w-28 portrait-xl:h-10 portrait-xl:font-base portrait-xl:p-3 portrait-xl:m-3'
    ]"
    :style="{
      fontSize: props.fontSize + 'px',
    }"
    type="button"
  >
    {{ props.label }}
  </button>
</template>

<style scoped>



</style>
