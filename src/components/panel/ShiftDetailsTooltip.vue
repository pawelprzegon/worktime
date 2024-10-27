<script setup>

import ShiftDetailsContainer from "@/components/panel/shift/shiftDetailsContainer.vue";

const props = defineProps({
  shift: Object
})
const date = props.shift.start.split(" ")[0]
const start = props.shift.start.split(" ")[1]
const stop = props.shift.stop.split(" ")[1]
const note = props.shift.note

</script>

<template>

  <div class="tooltip-container">
    <p>{{date}}</p>
    <ShiftDetailsContainer
      :label="'shift started'"
      :data="start"
    />

    <ShiftDetailsContainer
      :label="'shift stopped'"
      :data="stop"
    />

    <ShiftDetailsContainer
      :label="'note'"
      :data="note"
    />

  </div>

</template>

<style scoped>

.tooltip-container {
  visibility: hidden;
  background-color: gray;
  color: #fff;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  position: absolute;
  z-index: 1;
  transform: translateX(-50%);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.5s;
}

.shift:hover .tooltip-container {
  visibility: visible;
  opacity: 1;
}

.tooltip {
  width: 200px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

</style>