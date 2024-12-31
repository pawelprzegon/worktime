<script setup>

const props = defineProps({
  label: String,
  time: String,
  background: String,
  textColor: {
    type: String,
    required: false,
    default: 'platinum'
  },
  orient: {
    type: String,
    default: "col"
  }
})

</script>

<template>

  <div
      class="flex m-[2px]"
      :class="[`flex-${props.orient}`, props.background ? `bg-${props.background}` : ``]"
  >
    <p
        class="
        text-silver font-thin m-1

        portrait-2xs:text-3xs
        portrait-xs:text-2xs
        portrait-small:text-xs
        portrait-medium:text-sm
        portrait-large:text-base
        portrait-xl:text-lg
        "
        v-if="label">
      {{ label }}:
    </p>

    <h3
        class="
        m-[1px]

        portrait-2xs:text-2xs
        portrait-xs:text-xs
        portrait-small:text-sm
        portrait-medium:text-base portrait-medium:m-1
        portrait-large:text-lg
        portrait-xl:text-xl
        "
        :class="[props.textColor ? `text-${props.textColor}` : 'text-platinum']">
      {{ time }}
    </h3>

  </div>

</template>

<style scoped>

</style>