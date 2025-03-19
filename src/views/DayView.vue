<script setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import {getActiveShifts, startShift, stopShift} from "@/composables/fetchers.js";
import {useAuthStore} from "@/stores/authStore.js";
import ShiftTimeline from "@/components/ShiftTimeline.vue";
import {getTimeString} from "../composables/utils.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useLocationStore} from "@/stores/utilsStore.js";
import {useActiveShift} from "@/stores/shiftStore.js";
import Location from "@/components/dash/Location.vue";


const alert = useAlertStore()
const location = useLocationStore()
const intervalId = ref(null);
const authStore = useAuthStore();
const activeShift = useActiveShift();
const shiftTime = ref(null);
const currentDate = new Date().toISOString().split('T')[0];

const toggleShift = async () => {
  const userId = authStore.user.id
  const note = ''
  try{

    if (activeShift.shift) {
      await location.getCurrentLocation()
      const shiftId = activeShift.shift.id
      await stopShift(shiftId, userId, location.getLocation())
      activeShift.setShift(null)
    } else {
      console.log(userId)
      await startShift(userId, note, location.getLocation())
    }

  } catch (error) {
    alert.show("error", error.message)
  } finally {
    await checkActiveShift()
  }
}

const checkActiveShift = async () => {
  try {
    const actvShift = await getActiveShifts();
    if (actvShift) {
      activeShift.setShift(actvShift)
    }
  } catch (error) {

    console.error("Error fetching getActiveShifts:", error);
  }
};

const calculateTime = () => {

  const startTime = new Date(activeShift.shift.start);
  const currentTime = new Date();

  const diff = currentTime - startTime;

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  shiftTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

onMounted(async () => {
  try {
    await checkActiveShift();
    if (activeShift.shift) {
      calculateTime()
      intervalId.value = setInterval(async () => {
        await checkActiveShift();
        if (activeShift.shift) {
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
  <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
    {{currentDate}}
  </h1>

  <div class="max-w-[1000px]">

    <div v-if="activeShift.shift" class="relative w-full">
      <Location>
        <div class="absolute top-1 left-1 p-1">
          <h1 class="text-black text-3xl font-semibold dark:text-white ">start:<small class="ms-2 font-extrabold text-blue-500">{{getTimeString(activeShift.shift.start)}}</small></h1>
          <h1 class="text-black text-3xl font-semibold dark:text-white ">end:<small v-if="activeShift.stop" class=" ms-2 font-extrabold text-blue-500">{{getTimeString(activeShift.shift.stop)}}</small></h1>
          <h1 class="text-black text-3xl font-semibold dark:text-white ">time:<small class="ms-2 font-extrabold text-blue-500">{{shiftTime}}</small></h1>
        </div>
        <button @click="toggleShift" type="button" class="absolute bottom-3 left-3 w-56 h-16 px-6 py-3.5 m-1 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Stop shift
        </button>
      </Location>
      <ShiftTimeline :active-shift="activeShift.shift"/>

    </div>

    <div v-else class="relative w-full">
      <Location
          :accuracyInfo=true
      >

        <button
          @click="toggleShift"
          type="button"
          class="absolute bottom-3 left-3 w-56 h-16 px-6 py-3.5 text-xl font-medium shadow-md text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Start Shift
        </button>
      </Location>
    </div>
  </div>

  <div>
    Tasks
  </div>




</template>

<style scoped>

</style>