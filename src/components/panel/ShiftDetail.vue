<script setup>

import {defineProps} from 'vue'

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
</script>

<template>
  <div class="shift-details">

    <h3>Shift</h3>

    <div class="shift-detail">
      <p class="label">start:</p>
      <p class="shift-data">{{props.shift.start}}</p>
    </div>

    <div class="shift-detail">
      <p class="label">end:</p>
      <p class="shift-data">{{props.shift.stop}}</p>
    </div>

    <div class="shift-detail">
      <p class="label">work:</p>
      <p class="shift-data">{{calculateWork()}}</p>
    </div>

    <div class="shift-detail">
      <p class="label">note:</p>
      <p class="shift-data">{{props.shift.note}}</p>
    </div>

  </div>



</template>

<style scoped>

.shift-details {
  display: flex;
  flex-direction: column;
  background: #212121;
  border-radius: 10px;
  padding: 10px;
}

.shift-detail {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 2px;
  border-bottom: solid #3a3a3a 1px;

}

.label,
.shift-data {
  font-size: 14px;
}

</style>