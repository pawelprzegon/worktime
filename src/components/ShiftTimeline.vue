<script setup>

import {computed} from "vue";
import {now} from "@vueuse/core";

const props = defineProps({
  activeShift: {
    type: Object,
    required: true
  }
})

const getTime = (dt) => {
  const date = new Date(dt);

  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

const workShift = computed(() => {
  if (props.activeShift && props.activeShift.stop) {
    return {
      startTime: getTime(props.activeShift.start),
      endTime: getTime(props.activeShift.stop)
    };
  }

  return {
    startTime: getTime(props.activeShift.start),
    endTime: getTime(now())
  };
});
// Generowanie podziałki godzinowej od 00:00 do 23:00
const hours = Array.from({ length: 25 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

// Funkcja do konwersji czasu na procentowe przesunięcie
const timeToPercent = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return ((hours * 60 + minutes) / 1440) * 100; // 1440 min w 24h
};

const shiftStart = computed(() => (workShift.value.startTime ? timeToPercent(workShift.value.startTime) : 0));
const shiftEnd = computed(() => (workShift.value.endTime ? timeToPercent(workShift.value.endTime) : 0));
const shiftWidth = computed(() => shiftEnd.value - shiftStart.value);


</script>

<template>

  <div
      class="relative max-w-2xl bg-gray-200 dark:bg-neutral-700 rounded-lg p-8 ">
    <!-- Oś czasu -->
    <div class="relative h-10 flex items-center">
      <!-- Podziałka godzinowa -->
      <div
        v-for="(hour, index) in hours"
        :key="index"
        class="absolute top-0 text-xs text-gray-900 rotate-90"
        :style="{ left: `${(index / 24) * 100}%`, transform: 'translateX(-50%)' }"
      >
        <div class="text-black dark:text-white text-2xs mb-3 font-thin -rotate-90">{{ hour }}</div>
        <div class="w-[1px] h-4 bg-gray-400 mx-auto"></div> <!-- Mała kreska -->
      </div>

      <!-- Pasek pracy -->
      <div
        class="absolute top-1/2 h-3 animate-color-change rounded-lg shadow-xl"
        :style="{ left: `${shiftStart}%`, width: `${shiftWidth}%`, transform: 'translateY(50%) translateY(50%)' }"
      ></div>

      <!-- Punkt startu -->
      <div
        class="absolute top-6 text-xs bg-white px-1 py-0.5 rounded shadow-md rotate-90"
        :style="{ left: `${shiftStart}%`, transform: 'translateX(-50%) translateY(100%)' }"
      >
        {{ workShift.startTime }}
      </div>

      <!-- Punkt końca -->
      <div
        class="absolute top-6 text-xs bg-white px-1 py-0.5 rounded shadow-md"
        :style="{ left: `${shiftEnd}%`, transform: 'translateX(-50%) translateY(80%)' }"
      >
        {{ workShift.endTime }}
      </div>
    </div>
  </div>

</template>

<style scoped>

/* CSS */
@keyframes colorChange {
    0% {
        background-color: #27408a;
    }
    50% {
        background-color: #3b82f6;
    }
    100% {
        background-color: #27408a;

    }
}

.animate-color-change {
    animation: colorChange 2s infinite;
}

</style>