<script setup>

const props = defineProps({
  direction: {
    type: String,
    default: 'next',
    required: true,
  },
  size: {
    type: String,
    default: 16
  }
})



</script>

<template>

  <img
      src="../assets/img/next.png"
      alt="nav-icon"
      :style="{width: props.size + 'px', height: props.size + 'px'}"
      :class="['nav-icon', {'preview': props.direction === 'preview'}]"
  />

</template>

<style scoped>

.nav-icon {
  filter: invert(40%)
}

.nav-icon:hover {
  cursor: pointer;
  filter: invert(90%)
}

.preview {
  transform: rotate(180deg);
}

</style>