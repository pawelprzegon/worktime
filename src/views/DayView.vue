<script setup>

import ShiftTimeline from "@/components/ShiftTimeline.vue";
import Location from "@/components/dash/Location.vue";
import DayLayout from "@/components/day/DayLayout.vue";
import ActiveShiftData from "@/components/day/ActiveShiftData.vue";
import HolidaysData from "@/components/day/HolidaysData.vue";


const currentDate = new Date().toISOString().split('T')[0];

</script>

<template>


  <DayLayout>
    <template #title>
      {{currentDate}}
    </template>

    <template #map>
      <Location />
    </template>

    <template #activeShift>
      <ActiveShiftData />
    </template>

    <template #tasks>
      <HolidaysData />
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