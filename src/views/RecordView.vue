<script setup>

import { useAuthStore } from '@/stores/authStore.js';
import Calendarx from "@/components/userPanel/calendar/Calendarx.vue";
import Alert from "@/components/Alert.vue";
import Banner from "@/components/Banner.vue";


const authStore = useAuthStore();

</script>


<template>
  <Alert/>
  <Banner
      v-if='authStore.user.disabled'
      :main-text="'Account deactivated'"
      :additional-text="'Edit functions disabled'"
      :supplementary-text="': contact your administrator'"
  />
  <section>

    <Calendarx />

  </section>


</template>

<style scoped>

</style>