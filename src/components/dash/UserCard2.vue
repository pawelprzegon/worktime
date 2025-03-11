<script setup>

import ShiftTime from "@/components/dash/ShiftTime.vue";
import {onMounted, ref, watch} from "vue";
import {useAlertStore} from "@/stores/alertStore.js";
import {useActiveShifts} from "@/stores/shiftStore.js";
import {useLocationStore} from "@/stores/utilsStore.js";

const alert = useAlertStore()
const activeShifts = useActiveShifts()
const location = useLocationStore()

const props = defineProps({
  user: Object,
  checkActiveShift: Function
})

const activeShift = ref(null)
const activeShiftDuration = ref(null)
const isLoading = ref(true)

const calculateShift = (shiftStart) => {
  const currentTime = new Date();
  const shiftStartTime = new Date(shiftStart);

  const diff = currentTime - shiftStartTime;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const updateShiftTimes = () => {
  if (activeShift.value) {
    activeShiftDuration.value = calculateShift(activeShift.value.start);
  }
  isLoading.value = false;
};

onMounted(async () => {
  try {
    setInterval(updateShiftTimes, 1000);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

watch(() => activeShifts.activeShifts, (update) => {
  if (update && update.length > 0) {
    const foundShift = update.find(shift => shift.user_id === props.user.id);
    activeShift.value = foundShift || null;
  } else {
    activeShift.value = null;
  }
}, { deep: true });

</script>

<template>
  <div class="grid [grid-template-columns:repeat(auto-fit,minmax(120px,1fr))] gap-4">
    <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{props.user.first_name}}</h5>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{props.user.last_name}}</h5>
        </a>
        <ShiftTime
          :active-shift="activeShift"
          :shift-duration="activeShiftDuration"
        />
<!--        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>-->
        <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Read more
            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </a>
    </div>
  </div>

</template>

<style scoped>

</style>