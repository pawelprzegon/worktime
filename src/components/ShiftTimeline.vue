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
      class="relative bg-transparent dark:bg-transparent rounded-lg p-4 h-24">

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

      <!-- Pasek pracy -->
      <div
        class="absolute top-1/2 h-3 bg-blue-500 rounded-lg shadow-xl"
        :style="{ left: `${shiftStart}%`, width: `${shiftWidth}%`, transform: 'translateY(50%) translateY(50%)' }"
      ></div>

      <!-- Punkt startu -->
      <div
        class="absolute top-6 text-white text-xs bg-blue-500 px-1 py-0.5 rounded shadow-md rotate-90"
        :style="{ left: `${shiftStart}%`, transform: 'translateX(0%) translateY(120%)' }"
      >
        {{ workShift.startTime }}
      </div>

      <!-- Punkt końca -->
      <div
        class="absolute top-6 text-xs text-white bg-blue-500 px-1 py-0.5 rounded shadow-md rotate-90"
        :style="{ left: `${shiftEnd}%`, transform: 'translateX(-100%) translateY(120%)' }"
      >
        {{ workShift.endTime }}
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