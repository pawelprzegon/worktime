<script setup>

import ShiftTimeline from "@/components/ShiftTimeline.vue";
import GoogleMap from "@/components/GoogleMap.vue";
import DayLayout from "@/components/day/DayLayout.vue";
import ActiveShiftData from "@/components/day/ActiveShiftData.vue";
import HolidaysData from "@/components/day/HolidaysData.vue";
import TasksData from "@/components/day/TasksData.vue";


const currentDate = new Date().toISOString().split('T')[0];

</script>

<template>


  <DayLayout>
    <template #title>
      {{currentDate}}
    </template>

    <template #map>
      <GoogleMap />
    </template>

    <template #activeShift>
      <ActiveShiftData />
    </template>

    <template #tasks>
      <TasksData />
    </template>

    <template #holidays>
      <HolidaysData />
    </template>

    <template #timeline>
      <ShiftTimeline/>
    </template>

  </DayLayout>


</template>

<style scoped>

</style>