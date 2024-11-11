<script setup>
import { inject, onMounted, ref, watch } from 'vue';

const alert = inject('alert');

const closeAlert = () => {
  alert.status = null;
};

onMounted(() => {
  if (alert.status) {
    setTimeout(() => {
      alert.status = null;
    }, 5000);
  }
});

watch(() => alert.status, (newStatus) => {
  if (newStatus) {
    setTimeout(() => {
      alert.status = null;
    }, 5000);
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
  background-color: #6f986f;
}

.alert.error {
  background-color: #9a5858;
}

.alert.warning {
  background-color: #a9a963;
  color: black;
}
</style>
