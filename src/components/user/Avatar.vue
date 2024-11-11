<script setup>

import { defineProps, defineEmits} from "vue";

const props = defineProps({
  avatar: String,
  activeShift: Object,
  static: {
    type: Boolean,
    default: false
  }
})

const apiURL = import.meta.env.VITE_APP_API_URL

const emit = defineEmits(['toggle'])

const shiftToggle = () => {
  emit("toggle")
}

</script>

<template>
  <img
    :class="{
      'avatar': true,
      'off': !props.activeShift,
      'no-click': props.static
    }"
    :src="`${apiURL}/${props.avatar}`"
    alt="avatar"
    @click="shiftToggle"
  >
</template>

<style scoped>

.avatar {
  width: 120px;
  height: auto;
  margin: auto;
}

.avatar:hover {
  cursor: pointer;
  filter: grayscale(50%);
}

.off {
  filter: grayscale(100%);
}

.no-click {
  pointer-events: none;
}

@media (max-width: 1300px) {
  .avatar {
    width: 90px;
  }
}

</style>