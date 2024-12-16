<script setup>
import {inject, ref} from 'vue'
import {getHoursAsNumber} from "@/composables/utils.js";
import '@/assets/modal.css'
import CustomTextButton from "@/components/CustomTextButton.vue";
import {setOvertime} from "@/composables/fetchers.js";

const props = defineProps({
  maxToTake: Number,
  overtime: {
    type: Object,
    default: {}
  },
  monthOvertimes: {
    type: Number,
    required: false,
    default: 0
  },
  date: String
})

const maxToTake = ref(props.maxToTake)
const taken = ref(props.overtime?.hours || 0)

const emit = defineEmits(['takenHours', 'refreshModal'])
const alert = inject('alert');

const hoursPool = ref(getHoursAsNumber(props.monthOvertimes))
maxToTake.value = Math.floor((28800 - maxToTake.value) / 3600) + 1
maxToTake.value = maxToTake.value <= 0 ? 0 : maxToTake.value
const counter = ref(taken)

const increment = () => {
  if (counter.value < maxToTake.value &&
      counter.value < getHoursAsNumber(props.monthOvertimes)){
    counter.value += 1
    hoursPool.value--;
    emit('takenHours', counter.value)
  }

}

const decrement = () => {
  if (counter.value > 0) {
    counter.value -= 1
    hoursPool.value++;
    emit('takenHours', counter.value)
  }
}

const saveTakenHours = async () => {

  if (counter.value > maxToTake.value) {
    alert.show("warning", 'You picked higher amount of hours')
    return
  }
  const userId = sessionStorage.getItem('userId')

  const overtimeId = props.overtime?.id || null;

  const response = await setOvertime(userId, overtimeId, counter.value, props.date)
  if (response) {
    emit('refreshModal');
    alert.show(response.status, response.message)

  }
}

</script>

<template>
  <div class="overtime-container">
    <section class="overtime-status">

       <div style="display: inline-flex">
          <h3>max to pick:</h3>
          <span class="overtime-color">{{maxToTake}}</span>
        </div>

    </section>

    <div class="buttons-container">

      <div class="counter-label-container">
        <div class="label-data-container">
          <h3>overtime:</h3>
          <span class="overtime-color">{{hoursPool}}</span>
        </div>

        <div class="counter-engine">
          <img src="../../assets/img/decrease.png" alt="decrease" @click="decrement" />
          <span>{{ counter }}</span>
          <img src="../../assets/img/increase.png" alt="increase" @click="increment" />
        </div>
      </div>

      <div class="shift-details-header">
        <CustomTextButton
            label="save"
            :width="80"
            :padding="5"
            :margin="2"
            @click="saveTakenHours"
        />

      </div>

    </div>

  </div>

</template>

<style scoped>

.overtime-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
  padding: 5px;
  border-radius: 5px;
  background: var(--vt-c-black-light);
  height: fit-content;
}

.overtime-status {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: auto;
}

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