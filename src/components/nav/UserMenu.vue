<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore.js";
import {onClickOutside} from "@vueuse/core";

const apiURL = import.meta.env.VITE_APP_API_URL
const router = useRouter();
const authStore = useAuthStore();

const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);

const toggleUserMenuOpen = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
};

const logout = () => {
  if (authStore.isAuthenticated) {
    authStore.clearToken()

  } else {
    console.error('isAuthenticated is not available');
  }
};

const gotoLogout = () => {
  logout()
  router.push('/')
}

onClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false;
});
</script>

<template>
<div v-if="authStore.isAuthenticated" ref="userMenuRef" class="flex items-center">

  <button
      @click="toggleUserMenuOpen"
      type="button"
      aria-expanded="false"
      data-dropdown-toggle="dropdown-user"
      class="flex items-center justify-center rounded-full w-12 h-12 text-sm bg-neutral-900"
      :class="{'focus:ring-4 focus:ring-neutral-300 dark:focus:ring-blue-500' : isUserMenuOpen}"
  >
    <span class="sr-only">Open user menu</span>
    <img class="w-10 h-10 rounded-full" :src="`${apiURL}/${authStore.user.avatar}`" alt="user photo">
  </button>

  <div v-if="isUserMenuOpen" class="z-50 my-4 text-base list-none bg-white divide-y divide-neutral-100 rounded shadow-xl dark:bg-blue-500 dark:divide-blue-200 fixed top-20 end-14 group" id="dropdown-user">
    <div class="px-4 py-3" role="none">
      <p class="text-sm text-neutral-900 dark:text-white" role="none">
        {{authStore.user.firstName}} {{authStore.user.lastName}}
      </p>
      <p class="text-sm font-medium text-neutral-900 truncate dark:text-white" role="none">
        {{authStore.user.email}}
      </p>
    </div>
    <ul class="py-1" role="none">
      <li>
        <a href="#" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-100 hover:cursor-pointer dark:hover:bg-neutral-100 dark:hover:text-blue-800" role="menuitem">Settings</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-100 hover:cursor-pointer dark:hover:bg-neutral-100 dark:hover:text-blue-800" role="menuitem">Earnings</a>
      </li>
      <li>
        <a @click="gotoLogout" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:cursor-pointer dark:text-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-blue-800" role="menuitem">Log out</a>
      </li>
    </ul>
  </div>
</div>
</template>

<style scoped>

</style>