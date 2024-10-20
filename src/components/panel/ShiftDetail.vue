<script setup>

import {defineProps, ref, onMounted} from 'vue'

const start = ref('')
const stop = ref('')
const work = ref('')
const note = ref('')

const props = defineProps({
  shift: Object
})


const calculateWork = () => {
  const seconds = props.shift.work
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(secs).padStart(2, '0')
  ].join(':');
}

const calculateData = () => {
  const split_start = props.shift.start.split(' ')
  start.value = split_start[1]
  stop.value = props.shift.stop.split(' ')[1]
  work.value = calculateWork()
  note.value = props.shift.note
}

onMounted(async () => {
  calculateData()
});

</script>

<template>
  <div class="shift-details">

    <div class="timestamps">
      <p class="shift-data start">
        <img class="arrow" src="@/assets/shift/arrow/green_arrow.png" alt="green_arrow">
        {{start}}</p>
      <p class="shift-data stop">
        <img class="arrow turned" src="@/assets/shift/arrow/red_arrow.png" alt="green_arrow">
        {{stop}}</p>
    </div>

    <hr class="black-line">

    <p class="work">{{work}}</p>
    <p class="shift-data">job: {{note}}</p>

  </div>



</template>

<style scoped>

.arrow {
  width: 10px;
}

.turned {
  rotate: 180deg;
}

.black-line {
  height: 2px;
  background-color: #181818;
  border: none;
}

.shift-details {
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  border: solid 2px #181818;
  padding: 6px;
  margin: 3px;
}

.timestamps {
  display: flex;
  flex-direction: row;
  justify-content: space-between
}

.start {
  color: forestgreen;
}

.stop {
  color: indianred;
}

.work {
  margin-left: auto;
}

</style>