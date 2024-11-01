<script setup>

import DetailsContainer from "@/components/panel/DetailsContainer.vue";
import {computed} from "vue";

const props = defineProps({
  shifts: {
    type: Array,
    default: () => []
  },
  formatTime: {
    type: Function,
    required: true
  }
})

const date = computed(() => {
  if (props.shifts.length > 0) {
    return props.shifts[0].start.split("T")[0];
  }
  return '';
});

</script>

<template>

  <div
      v-if="props.shifts.length > 0"
      class="tooltip-container">
    <p>{{date}}</p>

    <div
        v-for="shift in props.shifts"
        class="shift-details"
    >

      <DetailsContainer
        :label="'started'"
        :data="shift.start"
      />

      <DetailsContainer
        :label="'stopped'"
        :data="shift.stop"
      />

      <DetailsContainer
        v-if="shift.note"
        :label="'note'"
        :data="shift.note"
      />

      <DetailsContainer
        v-else
        :label="'note'"
        :data="''"
      />

      <DetailsContainer
        :label="'work'"
        :data="props.formatTime(shift.work)"
      />

    </div>
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
  max-width: 400px;
}

.calendar-day:hover .tooltip-container {
  visibility: visible;
  opacity: 1;
}

.shift-details {
  background: #454545;
  padding: 10px;
  margin: 0 0 5px 0;
  font-size: 13px;
  border-radius: 5px;
}



</style>