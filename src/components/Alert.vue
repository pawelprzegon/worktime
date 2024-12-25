<script setup>
import { onMounted,  watch } from 'vue';
import {useAlertStore} from "@/stores/alertStore.js";

const alert = useAlertStore()

const closeAlert = () => {
  alert.status = null;
  alert.message = '';
};

onMounted(() => {
  if (alert.status) {
    setTimeout(() => {
    }, 5000);
  }
});
</script>

<template>
  <div
    v-if="alert.status"
    :class="[
      'fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md font-bold z-50 cursor-pointer w-1/2 text-center transition-opacity duration-500',
      alert.status === 'success' ? 'bg-emerald-700 text-white' :
      alert.status === 'error' ? 'bg-red-600 text-white' :
      alert.status === 'warning' ? 'bg-yellow-400 text-black' : ''
    ]"
    @click="closeAlert"
  >
    <p>{{ alert.message }}</p>
  </div>
</template>

<style scoped>

</style>
