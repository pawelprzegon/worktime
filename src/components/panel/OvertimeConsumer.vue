<script setup>
import {ref} from 'vue'

const props = defineProps({
  limit: {
    type: Number,
    required: false,
    default: 0
  }
})
const counter = ref(0)

const increment = () => {
  counter.value += 1
}

const decrement = () => {
  if (counter.value > 0) {
    counter.value -= 1
  }
}

</script>

<template>
  <div class="counter">
    <div class="counter-label">
      <p>Available Overtime to take:</p>
      <p>{{props.limit}}</p>
    </div>

    <img src="@/assets/img/decrease.png" alt="decrease" @click="decrement" />
    <span>{{ counter }}</span>
    <img src="@/assets/img/increase.png" alt="increase" @click="increment" />
  </div>
</template>

<style scoped>
.counter-label {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.counter-label p {
  margin: 2px
}

.counter-label p:nth-child(2) {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-overtime)
}

.counter {
  display: flex;
  align-items: center;
  gap: 10px;
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
</style>