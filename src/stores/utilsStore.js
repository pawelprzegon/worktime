import {defineStore} from "pinia";
import {ref} from "vue";
import {eachDayOfInterval, endOfMonth, startOfMonth} from "date-fns";
import {splitTime} from "@/composables/utils.js";

export const useSelectedDayStore = (id) =>
  defineStore(id, () => {
    const month = ref(new Date());
    const calculatedWorkTime = ref(0);
    const calculatedOvertimeTime = ref(0);

    const setMonth = (newMonth) => {
      month.value = newMonth;
    };

    const daysInMonth = ref([]);

    const updateDaysInMonth = () => {
      daysInMonth.value = eachDayOfInterval({
        start: startOfMonth(month.value),
        end: endOfMonth(month.value),
      }).map(date => ({
        date,
        hours: 0,
        note: '',
        shifts: { list: [], summary: 0 }
      }));
    };

    return {
      month,
      calculatedWorkTime,
      calculatedOvertimeTime,
      daysInMonth,
      updateDaysInMonth,
      setMonth,
    };
  })();

export const useCalendarMonthTime = (id) =>
  defineStore(id, () => {
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
        const splitTimeObj = splitTime(shiftTime)
        worktimeInSeconds.value += splitTimeObj.regular;
        overtimeInSeconds.value += splitTimeObj.overtime
      return splitTimeObj
    };

    return {
      overtimeInSeconds,
      worktimeInSeconds,
      subOvertime,
      clear,
      splitOvertime
    };
  })();