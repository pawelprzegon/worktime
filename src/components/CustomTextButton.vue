<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isClosed: {
    type: Boolean,
    default: false
  }

})
</script>

<template>
  <button
      class="
      flex items-center justify-center cursor-pointer box-border transition-all duration-200 rounded-md
      border border-third

      portrait-2xs:w-12 portrait-2xs:h-8 portrait-2xs:text-3xs portrait-2xs:p-[3px] portrait-2xs:m-[1px]
      portrait-xs:w-16 portrait-xs:h-8 portrait-xs:text-2xs portrait-xs:p-[2px] portrait-xs:m-[1px]
      portrait-small:w-20 portrait-small:h-8 portrait-small:text-xs portrait-small:p-2 portrait-small:m-2
      portrait-medium:w-32 portrait-medium:h-8 portrait-medium:text-sm portrait-medium:p-2 portrait-medium:m-2
      portrait-large:w-36 portrait-large:h-8 portrait-large:text-sm portrait-large:p-2 portrait-large:m-2
      portrait-xl:w-40 portrait-xl:h-10 portrait-xl:text-base portrait-xl:p-2 portrait-xl:m-2
      "
    :class="[
      { 'bg-beb text-black': props.isSelected, 'bg-mute': !props.isSelected },
      { 'hover:bg-secondary hover:text-white hover:border-gray-300': !props.isSelected },
      { 'cursor-not-allowed opacity-50 pointer-events-none': props.isClosed }
    ]"
    :disabled="props.isClosed"
    type="button"
  >
    {{ props.label }}
  </button>
</template>

<style scoped>
</style>
