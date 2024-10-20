<script setup>

import { defineProps, defineEmits, ref} from "vue";

const props = defineProps({
  avatar_url: String,
  activeShift: Object
})

const apiURL = import.meta.env.VITE_APP_API_URL

const emit = defineEmits(['toggle'])

const shiftToggle = () => {
  emit("toggle")
}

</script>

<template>

  <img
    :class="{'avatar': true, 'off': !props.activeShift}"
    :src="`${apiURL}/${props.avatar_url}`"
    alt="avatar"
    @click="shiftToggle"
  >

</template>

<style scoped>

.avatar {
  width: 150px;
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

</style>