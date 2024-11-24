<script setup>
import {inject, ref} from 'vue'
import {getHoursAsNumber} from "@/utils.js";
import '@/assets/modal.css'
import CustomTextButton from "@/components/utils/CustomTextButton.vue";
import {hoursTaken} from "@/fetchers.js";

const props = defineProps({
  shift: Object,
  limit: {
    type: Number,
    required: false,
    default: 0
  },

})

const emit = defineEmits(['takenHours', 'refreshModal'])
const alert = inject('alert');
const hoursPool = ref(getHoursAsNumber(props.limit))
const overtimeTaken = props.shift.overtime_taken.hours
const canTakeHours = ((28800 - props.shift.work) / 3600)
const available = ref(canTakeHours - overtimeTaken)
const counter = ref(0)

const increment = () => {
  if (counter.value < getHoursAsNumber(props.limit)){
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

const saveTakenHours = async (shift) => {
  const response = await hoursTaken(shift.user_id, shift.id,  counter.value)
  if (response) {
    emit('refreshModal');
    alert.show(response.status, response.message)
    if (response.ok){
      shift.isOverTime = false;
    }
  }
}

</script>

<template>
  <div class="overtime-container">
    <section class="overtime-status">
      <h2>{{available}}</h2>
      <div class="overtime-status-possibilities">
        <div style="display: inline-flex">
          <h3>max to pick:</h3>
          <span class="overtime-color">{{canTakeHours}}</span>
        </div>

        <div style="display: inline-flex">
          <h3>already taken:</h3>
          <span class="overtime-color">{{canTakeHours}}</span>
        </div>
      </div>

    </section>

    <div class="buttons-container">

      <div class="counter-label-container">
        <h2 class="overtime-color">{{hoursPool}}</h2>
        <div class="counter-engine">
          <img src="../../../assets/img/decrease.png" alt="decrease" @click="decrement" />
          <p>{{ counter }}</p>
          <img src="../../../assets/img/increase.png" alt="increase" @click="increment" />
        </div>
      </div>

      <div class="shift-details-header">
        <CustomTextButton
            label="save"
            :width="80"
            :padding="2"
            :margin="2"
            @click="saveTakenHours(shift)"
        />

      </div>

    </div>

  </div>

</template>

<style scoped>

.overtime-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 10px;
  padding: 10px;
  border-radius: 3px;
  background: var(--vt-c-black-light);
  height: 200px;
}

.overtime-status {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

.overtime-status h2 {
  font-size: 50px;
  margin: auto;
  padding: 30px;
  border-radius: 5px;
  color: var(--color-background-mute);
  background: var(--color-text-overtime);
  width: 80%;
}

.overtime-status-possibilities {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: auto;
  padding: 30px;
}


.counter {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-left: auto;
  background: var(--vt-c-black-light);
}

.counter-label {
  display: flex;
  flex-direction: row;
  align-items: center;
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
}

.counter-label-container,
.counter-engine {
  margin: 5px;
  padding: 5px;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.counter-label-container h2 {
  font-size: 30px;
  font-weight: 700;
}

.counter-label-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (max-width: 600px) {
  .overtime-container {
    grid-template-columns: none;
    grid-template-rows: 1fr 1fr;
  }
}
</style>