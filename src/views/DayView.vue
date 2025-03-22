<script setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import {getActiveShifts, getDateShifts, startShift, stopShift} from "@/composables/fetchers.js";
import {useAuthStore} from "@/stores/authStore.js";
import ShiftTimeline from "@/components/ShiftTimeline.vue";
import {getTimeString} from "../composables/utils.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useLocationStore} from "@/stores/utilsStore.js";
import {useActiveShift, useDateShifts} from "@/stores/shiftStore.js";
import Location from "@/components/dash/Location.vue";
import DayLayout from "@/components/day/DayLayout.vue";


const alert = useAlertStore()
const location = useLocationStore()
const intervalId = ref(null);
const authStore = useAuthStore();
const activeShift = useActiveShift();
const dateShifts = useDateShifts();
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
    const activ = await getActiveShifts();
    if (activ) {
      activeShift.setShift(activ)
      calculateTime();
      intervalId.value = setInterval(async () => {
        const activ = await getActiveShifts();
          if (activ) {
            activeShift.setShift(activ);
            calculateTime();
          } else {
            activeShift.setShift(null);
          }
      }, 5000);
    } else {
      activeShift.setShift(null)
    }

  } catch (error) {
    console.error("Error fetching getActiveShifts:", error);
  }
};

const checkDateShifts = async () => {
  try {
    const dtShifts = await getDateShifts(currentDate)
    if (dtShifts) {
      dateShifts.setShifts(dtShifts)
    } else {
      dateShifts.setShifts([])
    }
  }
  catch (error) {
    console.error("Error fetching getActiveShifts:", error);
  }
}

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
    await checkDateShifts();
    await checkActiveShift();
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


  <DayLayout>
    <template #title>
      {{currentDate}}
    </template>

    <template #left>

      <Location
          v-if="activeShift.shift"
      >
        <div class="absolute top-1 left-1 p-1">
          <h1 class="text-black text-3xl font-semibold dark:text-white ">start:<small class="ms-2 font-extrabold text-blue-500">{{getTimeString(activeShift.shift.start)}}</small></h1>
          <h1 class="text-black text-3xl font-semibold dark:text-white ">end:<small v-if="activeShift.stop" class=" ms-2 font-extrabold text-blue-500">{{getTimeString(activeShift.shift.stop)}}</small></h1>
          <h1 class="text-black text-3xl font-semibold dark:text-white ">time:<small class="ms-2 font-extrabold text-blue-500">{{shiftTime}}</small></h1>
        </div>
        <button @click="toggleShift" type="button" class="absolute bottom-3 left-3 w-56 h-16 px-6 py-3.5 m-1 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Stop shift
        </button>
      </Location>
    </template>

    <template #right>
      <Location
          v-if="!activeShift.shift"
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
    </template>

    <template #timeline>
      <ShiftTimeline/>
    </template>

  </DayLayout>


</template>

<style scoped>

</style>