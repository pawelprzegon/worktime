<script setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import {getActiveShifts} from "@/composables/fetchers.js";
import {useAuthStore} from "@/stores/authStore.js";
import ShiftTimeline from "@/components/ShiftTimeline.vue";
import ShiftLocations from "@/components/userPanel/modals/ShiftDetails/ShiftLocations.vue";


const intervalId = ref(null);
const authStore = useAuthStore()
const activeShift = ref(null)

const checkActiveShift = async () => {
  try {
      const shift = await getActiveShifts();
      activeShift.value = shift || {};
  } catch (error) {
    console.error("Error fetching getActiveShifts:", error);
  }
};

onMounted(async () => {
  try {
    await checkActiveShift();
    intervalId.value = setInterval(async () => {
      await checkActiveShift();
    }, 5000);
  } catch (error) {
    console.error("Error fetching users and active shifts:", error);
  }
});

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});


</script>

<template>

  <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">{{authStore.user.firstName}} {{authStore.user.lastName}}</h1>

  <div v-if="activeShift">
    <p>Shift ID: {{ activeShift.id }}</p>
  </div>
  <p v-else>Brak aktywnej zmiany</p>

  <h2 v-if="!activeShift" class="text-4xl font-bold dark:text-white">Start Shift</h2>
  <h2 v-else class="text-4xl font-bold dark:text-white">Shift status</h2>

  <ShiftTimeline
    v-if="activeShift"
    :active-shift="activeShift"
  />

  <ShiftLocations
    v-if="activeShift"
    :shift="activeShift"
  />

  <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
  <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Standard plan</h5>
  <div class="flex items-baseline text-gray-900 dark:text-white">
    <span class="text-3xl font-semibold">$</span>
    <span class="text-5xl font-extrabold tracking-tight">49</span>
    <span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
  </div>
    <ul role="list" class="space-y-5 my-7">
      <li class="flex items-center">
        <svg class="shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
      <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">2 team members</span>
      </li>
      <li class="flex">
        <svg class="shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">20GB Cloud storage</span>
      </li>
      <li class="flex">
        <svg class="shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Integration help</span>
      </li>
      <li class="flex line-through decoration-gray-500">
      <svg class="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        <span class="text-base font-normal leading-tight text-gray-500 ms-3">Sketch Files</span>
      </li>
      <li class="flex line-through decoration-gray-500">
        <svg class="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        <span class="text-base font-normal leading-tight text-gray-500 ms-3">API Access</span>
      </li>
      <li class="flex line-through decoration-gray-500">
        <svg class="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        <span class="text-base font-normal leading-tight text-gray-500 ms-3">Complete documentation</span>
      </li>
      <li class="flex line-through decoration-gray-500">
        <svg class="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        <span class="text-base font-normal leading-tight text-gray-500 ms-3">24×7 phone & email support</span>
      </li>
    </ul>
  <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Choose plan</button>
</div>
</template>

<style scoped>



</style>