<script setup>

import {computed} from "vue";
import {now} from "@vueuse/core";
import {useActiveShift, useDateShifts} from "@/stores/shiftStore.js";


const activeShift = useActiveShift();
const dateShifts = useDateShifts();

const getTime = (dt) => {
  const date = new Date(dt);

  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

const workShifts = computed(() => {
  const shiftsData = dateShifts.shifts.map((shift) => ({
    startTime: getTime(shift.start),
    endTime: getTime(shift.stop),
  }));

  if (activeShift.shift) {
    shiftsData.push({
      startTime: getTime(activeShift.shift.start),
      endTime: activeShift.shift.stop ? getTime(activeShift.shift.stop) : getTime(now()),
    });

  }

  return shiftsData;
});


// Generowanie podziałki godzinowej od 00:00 do 23:00
const hours = Array.from({ length: 25 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

// Funkcja do konwersji czasu na procentowe przesunięcie
const timeToPercent = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return ((hours * 60 + minutes) / 1440) * 100; // 1440 min w 24h
};
const colors = ["bg-blue-500", "bg-blue-400", "bg-blue-600", "bg-blue-700"];
</script>

<template>

  <div
      class="p-4 h-24">

    <!-- Oś czasu -->
    <div class="relative h-10 flex items-center">
      <!-- Podziałka godzinowa -->
      <div
        v-for="(hour, index) in hours"
        :key="index"
        class="absolute top-0 text-xs text-gray-900 rotate-90"
        :style="{ left: `${(index / 24) * 100}%`, transform: 'translateX(-50%)' }"
      >
        <div class="text-black dark:text-white text-2xs mb-3 -rotate-90">{{ hour }}</div>
        <div class="w-[1px] h-6 bg-gray-400 mx-auto"></div> <!-- Mała kreska -->
      </div>

      <div v-for="(shift, index) in workShifts" :key="index">

        <!-- Paseki pracy -->
        <div
          class="absolute top-1/2 h-3 rounded-lg shadow-xl translate-y-[120%]"
          :class="colors[index % colors.length]"
          :style="{
            left: `${timeToPercent(shift.startTime)}%`,
            width: `${timeToPercent(shift.endTime) - timeToPercent(shift.startTime)}%`
          }"
        ></div>

        <!-- Punkt startu -->
        <div
          class="absolute top-6 text-white text-xs px-1 py-0.5 rounded shadow-md"
          :class="[
            colors[index % colors.length],
            (timeToPercent(shift.endTime) - timeToPercent(shift.startTime)) < 11
              ? 'translate-x-[-100%] translate-y-[120%]'
              : 'translate-x-0 translate-y-[130%]'
          ]"
          :style="{ left: `${timeToPercent(shift.startTime)}%`}"
        >
          {{ shift.startTime }}
        </div>

        <!-- Punkt końca -->
        <div
          class="absolute top-6 text-xs text-white px-1 py-0.5 rounded shadow-md transform "
          :class="[
            colors[index % colors.length],
            (timeToPercent(shift.endTime) - timeToPercent(shift.startTime)) < 11
              ? 'translate-x-0 translate-y-[120%]'
              : 'translate-x-[-100%] translate-y-[130%]'
          ]"
          :style="{  left: `${timeToPercent(shift.endTime)}%`}"
        >
          {{ shift.endTime }}
        </div>

      </div>

    </div>

  </div>

</template>

<style scoped>

@keyframes colorChange {
    0% {
        background-color: #2367d7;
    }
    50% {
        background-color: #7bacf8;
    }
    100% {
        background-color: #2367d7;

    }
}

.animate-color-change {
    animation: colorChange 2s infinite;
}

</style>