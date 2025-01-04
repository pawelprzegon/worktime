<script setup>
import {ref} from 'vue'
import { getDateString, getHoursAsNumber} from "@/composables/utils.js";
import '@/assets/modal.css'
import CustomTextButton from "@/components/CustomTextButton.vue";
import {setToil} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {useDailyShiftsList} from "@/stores/calendarStore.js";
import {useAuthStore} from "@/stores/authStore.js";

const alert = useAlertStore();
const dailyShifts = useDailyShiftsList();
const monthStore = useSelectedMonthStore('calendar');
const authStore = useAuthStore()


const calculateMaxToTake = () => {
  let maxToil = dailyShifts.selectedDay.overtime > 0 ? 0 : Math.floor((28800 - dailyShifts.selectedDay.regular) / 3600);
  return maxToil + ((dailyShifts.selectedDay.regular % 3600) !== 0 ? 1 : 0);
}

const maxToTake = ref(calculateMaxToTake());
const toil = ref({
  id: dailyShifts.selectedDay.toil?.id || null,
  duration_seconds: dailyShifts.selectedDay.toil?.duration_seconds || 0
});

const hoursPool = ref(getHoursAsNumber(monthStore.selected.monthlyOvertime));
const counter = ref(toil.value.duration_seconds / 3600);


const increment = () => {
  if (counter.value < maxToTake.value &&
      counter.value < hoursPool.value){
    counter.value += 1
    hoursPool.value--;
  }
};

const decrement = () => {
  if (counter.value > 0) {
    counter.value -= 1
    hoursPool.value++;
  }
};

const saveTakenHours = async () => {

  const recalculatedCounterIntoSeconds = counter.value * 3600

  if (counter.value > maxToTake.value) {
    alert.show("warning", 'You picked higher amount of hours')
    return
  }
  try {
    const response = await setToil(authStore.user.id, toil.value.id, recalculatedCounterIntoSeconds, getDateString(dailyShifts.date))
    alert.show(response.status, response.message)
    await monthStore.refresh()
    await dailyShifts.updateDay()
  } catch (error) {
    alert.show('error', error.message)
    return { shifts: [], toils: [] };
  }
}

</script>

<template>

  <div
      class="
        grid w-full gap-1 place-items-center m-1 p-1

        portrait-xs:grid-rows-3
        portrait-small:grid-rows-none portrait-small:grid-cols-3
        portrait-medium:grid-rows-none portrait-medium:grid-cols-3
      ">

    <div class="inline-flex">
      <h3 class="m-auto text-sm">overtimes pool:</h3>
      <span class="text-2xl text-center font-bold w-10 text-overtime">{{hoursPool}}</span>
    </div>

    <div class="grid grid-cols-[50px_30px_50px] items-center justify-items-center">
      <img
          class="
          filter-invert-30 hover:filter-invert-100 hover:cursor-pointer

          "
          src="../../../../assets/img/decrease.png" alt="decrease" @click="decrement"/>
      <span
          class="text-2xl text-center font-bold"
          :class="counter > 0 ? 'text-turquoise' : 'text-platinum'">{{ counter }}</span>
      <img
          class="
          filter-invert-30 hover:filter-invert-100 hover:cursor-pointer
          "
          src="../../../../assets/img/increase.png" alt="increase" @click="increment"/>
    </div>


    <CustomTextButton
        label="save"
        @click="saveTakenHours"
    />

  </div>

</template>

<style scoped>

</style>