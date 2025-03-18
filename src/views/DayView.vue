<script setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import {getActiveShifts, startShift, stopShift} from "@/composables/fetchers.js";
import {useAuthStore} from "@/stores/authStore.js";
import ShiftTimeline from "@/components/ShiftTimeline.vue";
import {getTimeString} from "../composables/utils.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useLocationStore} from "@/stores/utilsStore.js";
import Location from "@/components/dash/Location.vue";

const alert = useAlertStore()
const location = useLocationStore()
const intervalId = ref(null);
const authStore = useAuthStore();
const activeShift = ref(null);
const shiftTime = ref(null);

const toggleShift = async () => {

  const userId = authStore.user.id
  const note = ''
  try{

    if (activeShift.value) {
      const shiftId = activeShift.value.id
      await stopShift(shiftId, userId, location.getLocation())
      activeShift.value = null
    } else {
      await startShift(userId, note, location.getLocation())
    }

  } catch (error) {
    alert.show("error", error.message)
  }
}

const checkActiveShift = async () => {
  try {
    activeShift.value = await getActiveShifts();
  } catch (error) {

    console.error("Error fetching getActiveShifts:", error);
  }
};

const calculateTime = () => {
  const startTime = new Date(activeShift.value.start);
  const currentTime = new Date();

  const diff = currentTime - startTime;

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  shiftTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

onMounted(async () => {
  try {
    await checkActiveShift();
    if (activeShift.value) {
      calculateTime()
      intervalId.value = setInterval(async () => {
        await checkActiveShift();
        if (activeShift.value) {
          calculateTime()
        }
      }, 5000);
    }

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

  <div v-if="activeShift" class="grid grid-cols-2">
    <div>
      <h2 class="text-4xl font-bold dark:text-white">Shift status</h2>
      <h1 class="text-3xl font-extrabold dark:text-white">start:<small class="ms-2 font-semibold text-blue-500">{{getTimeString(activeShift.start)}}</small></h1>
      <h1 class="text-3xl font-extrabold dark:text-white">end:<small v-if="activeShift.stop" class=" ms-2 font-semibold text-blue-500">{{getTimeString(activeShift.stop)}}</small></h1>
      <h1 class="text-3xl font-extrabold dark:text-white">time:<small class="ms-2 font-semibold text-blue-500">{{shiftTime}}</small></h1>
      <button @click="toggleShift" type="button" class="px-6 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Stop shift</button>
    </div>

    <div>
      <Location/>
      <ShiftTimeline
        :active-shift="activeShift"
      />
    </div>

  </div>

  <div v-else class="grid grid-cols-2">

     <a @click="toggleShift" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h2 class="mb-2 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">Start Shift</h2>
      <p class="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
    </a>

    <Location/>

  </div>

</template>

<style scoped>



</style>