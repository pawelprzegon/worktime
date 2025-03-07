<script setup>

const props = defineProps({
  label: String,
  time: String,
  background: String,
  text: {
    type: Object,
    required: false,
    default: () => ({
      color: 'platinum',
      weight: 'normal'
    })
  },
  orient: {
    type: String,
    default: "col"
  },
  justify: {
    type: String,
    default: 'start'
  }
})

</script>

<template>

  <div
      class="flex m-[2px]"
      :class="[`flex-${props.orient} justify-${props.justify}`, props.background ? `bg-${props.background}` : ``]"
  >
    <p
        class="
        text-silver font-thin m-1 text-

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
        :class="[`text-${props.text.color} font-${props.text.weight}`]">
      {{ time }}
    </h3>

  </div>

</template>

<style scoped>

</style>