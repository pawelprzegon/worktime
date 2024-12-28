<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button
    :class="[
      `flex items-center justify-center cursor-pointer box-border transition-all duration-200 text-sm rounded-md`,
      { 'bg-beb text-black': props.isActive, 'bg-mute': !props.isActive },
      { 'hover:bg-secondary hover:text-white hover:border-gray-300': !props.isActive },
      'portrait-xs:w-23 portrait-xs:h-6 portrait-xs:font-sm portrait-xs:p-2 portrait-xs:m-1',
      'portrait-small:w-23 portrait-small:h-7 portrait-small:font-sm portrait-small:p-2 portrait-small:m-2',
      'portrait-medium:w-25 portrait-medium:h-8 portrait-medium:font-sm portrait-medium:p-2 portrait-medium:m-2',
      'portrait-large:w-25 portrait-large:h-8 portrait-large:font-sm portrait-large:p-2 portrait-large:m-2',
      'portrait-xl:w-28 portrait-xl:h-10 portrait-xl:font-base portrait-xl:p-2 portrait-xl:m-2'
    ]"
    type="button"
  >
    {{ props.label }}
  </button>
</template>

<style scoped>
</style>
