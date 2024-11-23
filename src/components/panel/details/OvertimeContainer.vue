<script setup>
import {inject, ref} from 'vue'
import {getHoursAsNumber} from "@/utils.js";
import '@/assets/modal.css'
import CustomTextButton from "@/components/utils/CustomTextButton.vue";
import {hoursTaken} from "@/fetchers.js";

const props = defineProps({
  limit: {
    type: Number,
    required: false,
    default: 0
  },
  shift: Object
})

const emit = defineEmits(['takenHours', 'refreshModal'])
const alert = inject('alert');
const availableHours = ref(getHoursAsNumber(props.limit))
const counter = ref(0)

const increment = () => {
  if (counter.value < getHoursAsNumber(props.limit)){
    counter.value += 1
    availableHours.value--;
    emit('takenHours', counter.value)
  }

}

const decrement = () => {
  if (counter.value > 0) {
    counter.value -= 1
    availableHours.value++;
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
    <div>
      <h4 style="text-align: left">Overtime hours:</h4>
      <div class="counter">
        <div class="counter-label">
          <p>hours:</p>
          <p>{{availableHours}}</p>
        </div>
        <div class="counter-engine">
          <img src="../../../assets/img/decrease.png" alt="decrease" @click="decrement" />
          <p>{{ counter }}</p>
          <img src="../../../assets/img/increase.png" alt="increase" @click="increment" />
        </div>
      </div>


    </div>

    <div class="buttons-container">

      <div
        class="shift-details-header"
        id="over-time"
      >

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

.counter {
  display: inline-grid;
  width: 100%;
  grid-template-columns: 2fr 2fr 1fr;
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
  justify-content: end;
}

@media (max-width: 600px) {
  .overtime-container {
    grid-template-columns: none;
    grid-template-rows: 1fr 1fr;
  }
}
</style>