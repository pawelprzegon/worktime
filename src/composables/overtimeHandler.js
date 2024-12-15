import { computed, ref } from "vue";
import {defineStore} from "pinia";
import {formatTime} from "@/composables/utils.js";

export const useMonthTimeStore = defineStore("useMonthTimeStore", () => {
  const worktimeInSeconds = ref(0);
  const overtimeInSeconds = ref(0);

  const formattedWorkTime = computed(() => formatTime(worktimeInSeconds.value));
  const formattedOvertime = computed(() => formatTime(overtimeInSeconds.value));

  return {
    worktimeInSeconds,
    overtimeInSeconds,
    formattedWorkTime,
    formattedOvertime,
  };
});