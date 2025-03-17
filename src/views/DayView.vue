<script setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import {getActiveShifts, startShift, stopShift} from "@/composables/fetchers.js";
import {useAuthStore} from "@/stores/authStore.js";
import ShiftTimeline from "@/components/ShiftTimeline.vue";
import ShiftLocations from "@/components/userPanel/modals/ShiftDetails/ShiftLocations.vue";
import {getTimeString} from "../composables/utils.js";
import {now} from "@vueuse/core";
import {useAlertStore} from "@/stores/alertStore.js";
import {useLocationStore} from "@/stores/utilsStore.js";

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
      await props.checkActiveShift()
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
  const startTime = new Date(activeShift.value.start)
  const currentTime = new Date(now())
  const diff = currentTime - startTime

  const diffDate = new Date(diff);
  shiftTime.value = getTimeString(diffDate)
}

onMounted(async () => {
  try {
    await checkActiveShift();
    intervalId.value = setInterval(async () => {
      await checkActiveShift();
      if (activeShift) {
        calculateTime()
      }
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

  <div v-if="activeShift" class="grid grid-cols-2">
    <div>
      <h2 class="text-4xl font-bold dark:text-white">Shift status</h2>
      <h1 class="text-3xl font-extrabold dark:text-white">started:<small class="ms-2 font-semibold text-blue-500">{{getTimeString(activeShift.start)}}</small></h1>
      <h1 class="text-3xl font-extrabold dark:text-white">ended:<small v-if="activeShift.stop" class=" ms-2 font-semibold text-blue-500">{{getTimeString(activeShift.start)}}</small></h1>
      <h1 class="text-3xl font-extrabold dark:text-white">time:<small class="ms-2 font-semibold text-blue-500">{{shiftTime}}</small></h1>

    </div>


    <div>
      <ShiftLocations
        v-if="activeShift"
        :shift="activeShift"
      />
      <ShiftTimeline
        v-if="activeShift"
        :active-shift="activeShift"
      />
    </div>

  </div>

  <div v-else class="grid grid-cols-2">

    <a @click="toggleShift" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

      <h2 class="mb-2 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">Start Shift</h2>
      <p class="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
    </a>

  </div>

</template>

<style scoped>



</style>