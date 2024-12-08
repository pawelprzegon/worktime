import {defineStore} from "pinia";
import {ref} from "vue";
import {getOvertime} from "@/fetchers.js";

export const useSelectedMonthStore = defineStore('selectedMonth', () => {
  const selectedMonth = ref(new Date());

  const setMonth = (month) => {
    selectedMonth.value = month;
  };

  return {
    selectedMonth,
    setMonth
  };
});


export const useMonthTimeStore = defineStore("useMonthTimeStore", () => {
  const overtimeInSeconds = ref(0);
  const worktimeInSeconds = ref(0);

  const subOvertime = (overtimeTaken) => {
    overtimeInSeconds.value -= overtimeTaken;
  };

  const clear = () => {
    overtimeInSeconds.value = 0;
    worktimeInSeconds.value = 0;
  };

  const splitOvertime = (shiftTime) => {
    if (shiftTime <= 28800) {
      worktimeInSeconds.value += shiftTime;
      return {'work': shiftTime, 'overtime': 0};
    } else {
      worktimeInSeconds.value += 28800;
      overtimeInSeconds.value += shiftTime - 28800;
      return {'work': 28800, 'overtime': shiftTime - 28800};
    }
  };

  return {
    overtimeInSeconds,
    worktimeInSeconds,
    subOvertime,
    clear,
    splitOvertime
  };
});
