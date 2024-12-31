<script setup>
import {ref} from 'vue'
import {formatTime, getDateString, getHoursAsNumber} from "@/composables/utils.js";
import '@/assets/modal.css'
import CustomTextButton from "@/components/CustomTextButton.vue";
import {setToil} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {useDailyShiftsList} from "@/stores/calendarStore.js";
import {useAuthStore} from "@/stores/authStore.js";

const alert = useAlertStore()

const dailyShifts = useDailyShiftsList()
const monthTime = useSelectedMonthStore('calendar');
const authStore = useAuthStore()

const props = defineProps({
  shifts: Array,
})
const calculateMaxToTake = () => {
  let max = 0;
  props.shifts.forEach(shift => {
    max += shift.overtime > 0 ? 0 : Math.floor((28800 - shift.regular) / 3600)
  })
  return max
}

const maxToTake = ref(calculateMaxToTake())
const toilTaken = ref({
  id: dailyShifts.selectedDay.toil?.id || null,
  hours: dailyShifts.selectedDay.toil?.hours || 0
})
const hoursPool = ref(getHoursAsNumber(monthTime.selected.monthlyOvertime))
const counter = ref(toilTaken.value.hours)




const increment = () => {
  if (counter.value < maxToTake.value &&
      counter.value < hoursPool.value){
    counter.value += 1
    hoursPool.value--;
  }
}

const decrement = () => {
  if (counter.value > 0) {
    counter.value -= 1
    hoursPool.value++;
  }
}

const saveTakenHours = async () => {

  if (counter.value > maxToTake.value) {
    alert.show("warning", 'You picked higher amount of hours')
    return
  }

  const response = await setToil(authStore.user.id, toilTaken.value.id, counter.value, getDateString(dailyShifts.date))
  if (response) {
    alert.show(response.status, response.message)
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
      <h3 class="m-auto">overtimes pool:</h3>
      <span class="text-overtime">{{hoursPool}}</span>
    </div>

    <div class="grid grid-cols-[50px_30px_50px] items-center justify-items-center">
      <img
          class="
          filter-invert-30 hover:filter-invert-100 hover:cursor-pointer

          "
          src="../../../../assets/img/decrease.png" alt="decrease" @click="decrement"/>
      <span>{{ counter }}</span>
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



span {
  font-size: 18px;
  font-weight: bold;
  width: 40px;
  text-align: center;
}

.buttons-container {
  display: inline-flex;
  justify-content: flex-end
}

@media (max-width: 800px) {
  .overtime-status {
    padding: 5px;
  }

  h3 {
    font-size: 11px;
  }

  .counter-label-container {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .overtime-status {
    padding: 3px;
  }

  h3 {
    font-size: 10px;
  }
}
</style>