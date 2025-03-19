<script setup>

import {onMounted, ref} from 'vue'
import {useAuthStore} from "@/stores/authStore.js";
import Alert from "@/components/Alert.vue";
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
  <Alert/>
  <nav class="fixed top-0 z-40 w-full bg-white border-b border-neutral-200 dark:bg-neutral-900 dark:border-none shadow-xl">
    <NavBar />
  </nav>

  <Sidebar />

  <main
      id="main"
      class="min-h-screen p-10 mt-24 overflow-auto overflow-x-hidden overflow-y-auto bg-stone-100 dark:bg-primary"
      :class="authStore.isAuthenticated ? 'lg:ml-64' : 'lg:ml-0'"
  >
    <RouterView />
  </main>


  <footer
      id="footer"
      class="fixed bottom-0 left-0 z-20 w-full p-4 bg-stone-100 border-t border-neutral-200 text-right dark:bg-primary dark:border-neutral-950">
    {{today}}
  </footer>


</template>

<style scoped>

</style>