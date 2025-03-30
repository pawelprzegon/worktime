<script setup>

import {getTimeString} from "@/composables/utils.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useLocationStore} from "@/stores/utilsStore.js";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useAuthStore} from "@/stores/authStore.js";
import {useActiveShift, useDateShifts} from "@/stores/shiftStore.js";
import {getActiveShifts, getDateShifts, startShift, stopShift} from "@/composables/fetchers.js";
import {storeToRefs} from "pinia";
import CardLayout from "@/components/day/CardLayout.vue";
import LabelData from "@/components/LabelData.vue";


const alert = useAlertStore()
const location = useLocationStore()
const intervalId = ref(null);
const authStore = useAuthStore();
const activeShift = useActiveShift();
const { shift } = storeToRefs(activeShift);
const dateShifts = useDateShifts();
const shiftTime = ref(null);
const currentDate = new Date().toISOString().split('T')[0];

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

</script>

<template>

  <CardLayout
      title="Info"
  >
    <div v-if="shift">

      <div class="p-1">
        <LabelData :data="getTimeString(activeShift.shift.start)" label="start"/>
        <LabelData v-if="activeShift.stop" :data="getTimeString(activeShift.shift.stop)" label="end"/>
        <LabelData :data="shiftTime" label="time"/>
      </div>
      <button @click="toggleShift" type="button" class="w-56 h-16 px-6 py-3.5 m-1 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Stop shift
      </button>

    </div>

    <div v-else>
      <button
        @click="toggleShift"
        type="button"
        class="w-56 h-16 px-6 py-3.5 text-xl font-medium shadow-md text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Start Shift
      </button>
    </div>
  </CardLayout>


</template>

<style scoped>

</style>