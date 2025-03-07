<script setup>
import {ref, watch} from 'vue'
import {getHoursAsNumber} from "@/composables/utils.js";
import '@/assets/modal.css'
import CustomTextButton from "@/components/CustomTextButton.vue";
import {useAlertStore} from "@/stores/alertStore.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {usedayStore} from "@/stores/calendarStore.js";

const alert = useAlertStore();
const dayStore = usedayStore();
const monthStore = useSelectedMonthStore('calendar');

const hoursPool = ref(null)
const recHoursPool =ref(null)
const counter = ref(null);

const increment = () => {

  if (counter.value < dayStore.maxToTake &&
      counter.value < hoursPool.value){
    counter.value += 1
    recHoursPool.value--;
  }
};

const decrement = () => {
  if (counter.value > 0) {
    counter.value -= 1
    recHoursPool.value++;
  }
};

const handleSaveToil = async() => {
  const response = await dayStore.saveToil(counter.value)
  alert.show(response.status, response.message)
}

watch(()=> dayStore.date, () => {
  hoursPool.value = getHoursAsNumber(monthStore.selected.monthlyOvertime);
  recHoursPool.value = getHoursAsNumber(monthStore.selected.monthlyOvertime);
  counter.value = (dayStore.toil?.duration_seconds || 0) / 3600;
})

</script>

<template>

  <div
      class="
        grid gap-1 place-items-center m-1 p-1

        portrait-xs:grid-rows-3
        portrait-small:grid-rows-none portrait-small:grid-cols-3
        portrait-medium:grid-rows-none portrait-medium:grid-cols-3
      ">

    <div class="inline-flex">
      <h3 class="m-auto text-sm">overtimes pool:</h3>
      <span class="text-2xl text-center font-bold w-10 text-overtime">{{recHoursPool}}</span>
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
        @click="handleSaveToil"
    />

  </div>

</template>

<style scoped>

</style>