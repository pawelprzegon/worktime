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
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const logout = () => {
  if (authStore.isAuthenticated) {
    authStore.clearToken();
  } else {
    console.error('isAuthenticated is not available');
  }
};

const gotoLogout = () => {
  toggleUserMenuOpen();
  logout();
  router.push('/');
}

const goToUserAccount = () => {
  toggleUserMenuOpen();
  router.push('/user');
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
      class="flex items-center justify-center rounded-full w-12 h-12 text-sm"
      :class="{'focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500' : isUserMenuOpen}"
  >
    <img class="w-10 h-10 object-cover rounded-full" :src="`${apiURL}/${authStore.user.avatar}`" alt="user photo">
  </button>

  <div v-if="isUserMenuOpen"
       class="p-1 top-20 end-52 z-50 my-4 text-base list-none divide-y rounded shadow-2xl bg-blue-500 dark:divide-blue-200 fixed group"
       id="dropdown-user"
  >
    <div class="px-4 py-3" role="none">
      <p class="text-sm text-white" role="none">
        {{authStore.user.firstName}} {{authStore.user.lastName}}
      </p>
      <p class="text-sm font-medium  truncate text-white" role="none">
        {{authStore.user.email}}
      </p>
    </div>
    <ul class="py-1" role="none">
      <li>
        <a @click="goToUserAccount" class="block px-4 py-2 text-sm text-neutral-100 hover:cursor-pointer hover:bg-neutral-100 hover:text-blue-800" role="menuitem">Account</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 text-sm text-neutral-100 hover:cursor-pointer hover:bg-neutral-100 hover:text-blue-800" role="menuitem">Earnings</a>
      </li>
      <li>
        <a @click="gotoLogout" class="block px-4 py-2 text-sm hover:cursor-pointer text-neutral-100 hover:bg-neutral-100 hover:text-blue-800" role="menuitem">Log out</a>
      </li>
    </ul>
  </div>
</div>
</template>

<style scoped>

</style>