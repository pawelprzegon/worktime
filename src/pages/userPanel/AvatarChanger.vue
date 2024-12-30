<script setup>

import Avatar from "@/components/Avatar.vue";
import ChangeAvatarModal from "@/pages/userPanel/modals/ChangeAvatarModal.vue";
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
  <section class="relative z-30 m-2">
    <Avatar :avatar="avatar" :static="true" />
    <img
      class="absolute bottom-0 right-0 w-6 h-6 filter invert-[50%] hover:invert-100 hover:animate-spin cursor-pointer"
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

</style>