<script setup>
import {ref} from 'vue'
import {getDateString, getHoursAsNumber} from "@/composables/utils.js";
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
  maxToTake: Number,
  monthOvertimes: {
    type: Number,
    required: false,
    default: 0
  },
  shift: Object,
})

const maxToTake = ref(props.shift.overtime > 0 ? 0 : Math.floor((28800 - props.shift.regular) / 3600 + 1))
const toilTaken = ref({
  id: dailyShifts.selectedDay.toil?.id || null,
  hours: dailyShifts.selectedDay.toil?.hours || null
})

const emit = defineEmits(['takenHours', 'refreshModal'])

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
    emit('refreshModal');
    alert.show(response.status, response.message)

  }
}

</script>

<template>

  <div class="grid grid-cols-[auto_150px]">


    <div class="grid grid-cols-[150px_auto] justify-items-center">
      <div class="label-data-container">
        <h3>overtimes pool:</h3>
        <span class="overtime-color">{{hoursPool}}</span>
      </div>

      <div class="grid grid-cols-[50px_30px_50px] items-center justify-items-center">
        <img src="../../../assets/img/decrease.png" alt="decrease" @click="decrement"/>
        <span>{{ counter }}</span>
        <img src="../../../assets/img/increase.png" alt="increase" @click="increment"/>
      </div>
    </div>

    <div class="place-items-end">
        <CustomTextButton
            label="save"
            @click="saveTakenHours"
        />
    </div>

  </div>

</template>

<style scoped>

.label-data-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

h3 {
  margin: auto;
}

.counter-label p {
  margin: 0 2px;
  padding: 0;
}

.counter-label p:nth-child(2) {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-overtime)
}

.overtime-color {
  color: var(--color-text-overtime)
}

.counter-engine {
  display: grid;
  grid-template-columns: repeat(3, 30px);
  justify-items: center;
  align-items: center;
}

.counter-engine p {
  font-size: 20px;
  font-weight: 700;
  margin: 0 10px;
}


.counter-label-container{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
}

img {
  filter: invert(40%)
}

img:hover {
  filter: invert(100%);
  cursor: pointer;
}

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