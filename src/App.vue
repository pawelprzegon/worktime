<script setup>

import {onMounted, ref} from 'vue'
import {useAuthStore} from "@/stores/authStore.js";
import NavBar from "@/components/nav/NavBar.vue";
import Sidebar from "@/components/sidebar/Sidebar.vue";


const authStore = useAuthStore();
const today = ref(new Date);

onMounted(() => {



  setInterval(() => {
    let now = new Date()
    today.value = now.toLocaleTimeString("en-GB", {
    timeZone: "Europe/Warsaw",
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: 'long'
  })
  }, 1000)
});

</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Nagłówek -->
    <nav class="fixed top-0 z-40 w-full bg-white border-b border-neutral-200 dark:bg-neutral-900 dark:border-none shadow-xl">
      <NavBar />
    </nav>

    <!-- Główna zawartość -->
    <div class="flex flex-1">
      <Sidebar />

      <main
        id="main"
        class="px-2 sm:px-4 md:px-6 lg:px-10 lg:pb-0 mt-24 pt-10 overflow-none bg-stone-100 dark:bg-primary flex-1"
        :class="authStore.isAuthenticated ? 'lg:ml-64' : 'lg:ml-0'"
      >
        <RouterView />
      </main>
    </div>

    <!-- Stopka -->
    <footer
      id="footer"
      class="w-full p-4 bg-stone-100 border-t border-neutral-200 text-right dark:bg-primary dark:border-neutral-950 h-12"
    >
      {{ today }}
    </footer>
  </div>
</template>

<style scoped>

</style>