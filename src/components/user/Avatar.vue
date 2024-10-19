<script setup>

import {computed, defineProps, defineEmits} from "vue";

const props = defineProps({
  avatar: String,
  activeShift: Object
})

const emit = defineEmits(['toggle'])

const avatarSrc = computed(() => {
  return new URL(`../../assets/avatar/${props.avatar}`, import.meta.url).href;
});

const shiftToggle = () => {
  emit("toggle")
}

</script>

<template>

  <img
    :class="{'avatar': true, 'off': !props.activeShift}"
    :src="avatarSrc"
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