<script setup>

import {onMounted, ref, watch} from 'vue'
import {useAuthStore} from "@/stores/authStore.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {getMe} from "@/composables/fetchers.js";
import Alert from "@/components/Alert.vue";
import NavBar from "@/components/nav/NavBar.vue";
import Sidebar from "@/components/sidebar/Sidebar.vue";


const authStore = useAuthStore();
const alert = useAlertStore();
const userName = ref('');
const today = ref(new Date);


const getMeData = async () => {
  try{
    const response =  await getMe()
    userName.value = `${response.first_name} ${response.last_name}`
  } catch (error) {
    alert.show('error', error)
  }
}


watch(() => authStore.isAuthenticated, (newStatus) => {
  if (newStatus) {
    getMeData();
  }
});

onMounted(() => {
if (authStore.isAuthenticated) {
  getMeData();
}

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

  <div
      class="p-6 mt-24 overflow-auto"
      :class="authStore.isAuthenticated ? 'lg:ml-64' : 'lg:ml-0'"
  >
    <main id="main" class="h-auto overflow-x-hidden overflow-y-auto">
      <RouterView />
    </main>
  </div>

  <footer
      id="footer"
      class="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-neutral-200 shadow-sm text-right
      dark:bg-primary dark:border-none">
    {{today}}
  </footer>


</template>

<style scoped>

</style>