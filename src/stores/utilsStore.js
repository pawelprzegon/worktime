import {defineStore} from "pinia";
import {ref} from "vue";
import {eachDayOfInterval, endOfMonth, startOfMonth} from "date-fns";

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
  })();