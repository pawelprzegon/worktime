<script setup>

import Avatar from "@/components/Avatar.vue";
import ChangeAvatarModal from "@/pages/userPanel/ChangeAvatarModal.vue";
import {ref} from "vue";

defineProps(["avatar"]);
const emit = defineEmits(["refresh"]);

const isAvatarChangerOpen = ref(false)

const openAvatarChanger = () => {
  isAvatarChangerOpen.value = true;
};

const closeAvatarChanger = () => {
  isAvatarChangerOpen.value = false;
  emit("refresh");
};

</script>

<template>

  <section class="avatar-container">
    <Avatar :avatar="avatar" :static="true" />
    <img
      class="avatar-overlay"
      src="../../assets/img/refresh.png"
      alt="overlay"
      @click="openAvatarChanger()"
    />
    <ChangeAvatarModal
      v-if="isAvatarChangerOpen"
      :close-modal="closeAvatarChanger"
    />
  </section>

</template>

<style scoped>

.avatar-container {
  position: relative;
}

.avatar-overlay {
  position: absolute;
  filter: invert(50%);
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
}

.avatar-overlay:hover {
  filter: invert(100%);
  animation: rotateAnimation 2s linear infinite;
  cursor: pointer;
}

@keyframes rotateAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>