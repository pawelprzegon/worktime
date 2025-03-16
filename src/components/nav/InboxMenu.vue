<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore.js";
import {onClickOutside} from "@vueuse/core";

const apiURL = import.meta.env.VITE_APP_API_URL
const router = useRouter();
const authStore = useAuthStore();

const isInboxMenuOpen = ref(false);
const userMenuRef = ref(null);

const toggleInboxMenuOpen = () => {
  isInboxMenuOpen.value = !isInboxMenuOpen.value;
};

const logout = () => {
  if (authStore.isAuthenticated) {
    authStore.clearToken();

  } else {
    console.error('isAuthenticated is not available');
  }
};

const gotoLogout = () => {
  toggleInboxMenuOpen();
  logout();
  router.push('/');
}

const goToUserAccount = () => {
  toggleInboxMenuOpen();
  router.push('/user');
}

onClickOutside(userMenuRef, () => {
  isInboxMenuOpen.value = false;
});

</script>

<template>
<div v-if="authStore.isAuthenticated" ref="userMenuRef" class="flex items-center">

  <button
      @click="toggleInboxMenuOpen"
      type="button"
      aria-expanded="false"
      data-dropdown-toggle="dropdown-user"
      class="flex items-center justify-center w-12 h-12 text-sm dark:bg-neutral-900"
  >
    <img class="dark:filter-invert-100" src="@/assets/img/navbar/messages.png" alt="user photo">
  </button>

</div>
</template>

<style scoped>

</style>