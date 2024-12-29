import { computed, ref } from "vue";
import {defineStore} from "pinia";
import {formatTime} from "@/composables/utils.js";

export const useMonthTimeStore = defineStore("useMonthTimeStore", () => {
  const monthlyWorkTime = ref(0);
  const monthlyOvertime = ref(0);

  const formattedWorkTime = computed(() => formatTime(monthlyWorkTime.value));
  const formattedOvertime = computed(() => formatTime(monthlyOvertime.value));

  return {
    monthlyWorkTime,
    monthlyOvertime,
    formattedWorkTime,
    formattedOvertime,
  };
});