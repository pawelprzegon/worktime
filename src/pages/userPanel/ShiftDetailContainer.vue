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
    :class="['flex m-1', `flex-${props.orient}`, props.background ? `bg-${props.background}` : ``]"
  >
    <p
        class="text-silver font-thin m-1"
        v-if="label">
      {{ label }}:
    </p>

    <h3 :class="['m-1 text-lg', props.textColor ? `text-${props.textColor}` : 'text-platinum']">
      {{ time }}
    </h3>

  </div>

</template>

<style scoped>

</style>