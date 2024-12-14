import {defineStore} from "pinia";
import {ref} from "vue";
import {eachDayOfInterval, endOfMonth, startOfMonth} from "date-fns";


export const usePrivilegedSelectedUser = defineStore('usePrivilegedSelectedUser', () => {
  const user = ref(null);

  const setUser = (newUser) => {
    user.value = newUser;
  };

  return {
    user,
    setUser
  };
});

export const usePrivilegedSelectedMonth = defineStore('privilegedSelectedMonth', () => {
  const month = ref(new Date());

  const daysInMonth = ref(
    eachDayOfInterval({
      start: startOfMonth(month.value),
      end: endOfMonth(month.value),
    }).map(date => ({
      date,
      hours: 0,
      note: '',
      shifts: { list: [], summary: 0 }
    }))
  );

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

  const setMonth = (newMonth) => {
    month.value = newMonth;
  };

  return {
    month,
    daysInMonth,
    updateDaysInMonth,
    setMonth
  };
});

export const usePrivilegedMonthTime = defineStore("usePrivilegedMonthTime", () => {
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