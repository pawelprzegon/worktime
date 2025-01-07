<script setup>

import {useAuthStore} from "@/stores/authStore.js";

const authStore = useAuthStore();

const props = defineProps({
  activeShift: {
    type: Object,
    default: {}
  },
  static: {
    type: Boolean,
    default: false
  }
})


const avatarImg = new URL(`../../public/${authStore.user.avatar}`, import.meta.url).href;

const emit = defineEmits(['toggle'])

const shiftToggle = () => {
  emit("toggle")
}

</script>

<template>
  <img
      class="
      w-24 h-24 mx-auto object-cover object-center rounded-full cursor-pointer

      portrait-2xs:w-20 portrait-2xs:h-20
      portrait-xs:w-22 portrait-xs:h-22
      portrait-small:w-22 portrait-small:h-22
      portrait-medium:w-28 portrait-medium:h-28
      portrait-large:w-28 portrait-large:h-28
      portrait-xl:w-28 portrait-xl:h-28
      "
    :class="[{
      'grayscale': !props.activeShift,
      'cursor-default': props.static
    }]"
    :src="avatarImg"
    alt="avatar"
    @click="shiftToggle"
  >

</template>

<style scoped>


</style>