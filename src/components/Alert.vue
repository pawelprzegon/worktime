<script setup>
import { inject, onMounted, ref, watch } from 'vue';

// Wstrzykujemy alert z globalnych właściwości lub z Vuex
const alert = inject('alert'); // jeśli używasz provide/inject
// const alert = useStore().state.alert; // jeśli używasz Vuex

const closeAlert = () => {
  alert.status = null; // Zamykanie alertu po kliknięciu
};

// Automatyczne zamknięcie alertu po 3 sekundach
onMounted(() => {
  if (alert.status) {
    setTimeout(() => {
      alert.status = null; // Zniknięcie alertu po 3 sekundach
    }, 3000);
  }
});

// Możesz także używać watch do reagowania na zmiany statusu alertu
watch(() => alert.status, (newStatus) => {
  if (newStatus) {
    setTimeout(() => {
      alert.status = null; // Zniknięcie alertu po 3 sekundach
    }, 3000);
  }
});
</script>

<template>
  <div
    v-if="alert.status"
    :class="['alert', alert.status]"
    class="alert-container"
    @click="closeAlert"
  >
    <p>{{ alert.message }}</p>
  </div>
</template>

<style scoped>
.alert-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  z-index: 9999;
  cursor: pointer;
  max-width: 80%;
  transition: opacity 0.5s ease-in-out;
}

.alert.success {
  background-color: #4a7c4a;
}

.alert.error {
  background-color: #9a5858;
}

.alert.warning {
  background-color: #a9a963;
  color: black;
}
</style>
