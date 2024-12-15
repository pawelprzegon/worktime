import {ref} from "vue";
import {defineStore} from "pinia";


export const useCalendarMonthTime = defineStore("useCalendarMonthTime", () => {
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
