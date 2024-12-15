import {ref} from "vue";
import {defineStore} from "pinia";
import {add, eachDayOfInterval, endOfMonth, format, startOfMonth, sub} from "date-fns";
import {getOvertime, getUserShifts} from "@/fetchers.js";

const apiURL = import.meta.env.VITE_APP_API_URL
export const url = apiURL

export const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(0);

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}

export function getHoursAsNumber(seconds) {
  const hours = Math.floor(seconds / 3600);
  return hours.toString().padStart(2, '0')
}

export function getTime(timestamp) {
  const date = new Date(timestamp);

  return date.toLocaleTimeString("pl-PL", {
    timeZone: "Europe/Warsaw",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

export function getDate(timestamp) {
  const date = new Date(timestamp);

  return  date.toLocaleDateString("pl-PL", {
    timeZone: "Europe/Warsaw",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
  });
}

export const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

export const clearCache = () => {
  sessionStorage.clear();
}

export const getLastStartStop = (shift, type) => {
  // sprawdzanie czy są jakieś korekty i jeśli tak to nadpisanie nimi start i stop
  if (shift.time_correction.length > 0) {
    const filtered = shift.time_correction.filter(c => c.corrected === type);

    if (filtered.length > 0){
      return filtered[filtered.length -1]['date']
    }

  }
  switch (type) {
    case 'start':
      return shift.start
    case 'stop':
      return shift.stop
  }
}

export const getLast = (day) => {
  let shifts = []
  day.shifts.list.forEach(shift => {
    let obj = {
      startTime: Number,
      stopTime: Number,
    }
    obj.startTime = getLastStartStop(shift, 'start')
    obj.stopTime = getLastStartStop(shift, 'stop')
    shifts.push(obj)
  })
  return shifts
}

export const useModal = (selectedMonth) => {
  const isModalOpen = ref(false);
  const selectedDay = ref(null);
  const modalKey = ref(0);

  const openModal = (day) => {
    selectedDay.value = day;
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const refreshModal = (getDataHandler) => {
    const selectedDate = selectedDay.value.date;
    getDataHandler();

    selectedDay.value = selectedMonth.daysInMonth.find(day =>
      format(day.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
    modalKey.value++;
  };

  return {
    isModalOpen,
    selectedDay,
    modalKey,
    openModal,
    closeModal,
    refreshModal,
  };
};

export const useCalendarDays = (selectedMonth) => {
  const getDaysBefore = () => {
    const startDay = new Date(selectedMonth.daysInMonth[0]['date']).getDay() || 7;
    return range(2, startDay);
  };

  const getDaysAfter = () => {
    const endDay = new Date(selectedMonth.daysInMonth[selectedMonth.daysInMonth.length - 1]['date']).getDay() || 7;
    return range(endDay, 6);
  };

  return { getDaysBefore, getDaysAfter };
};

export const useCalendarNavigation = (selectedMonth, updateHandler) => {
  const prevMonth = () => {
    selectedMonth.month = sub(selectedMonth.month, { months: 1 });
    selectedMonth.updateDaysInMonth();
    updateHandler();
  };

  const nextMonth = () => {
    selectedMonth.month = add(selectedMonth.month, { months: 1 });
    selectedMonth.updateDaysInMonth();
    updateHandler();
  };

  return { prevMonth, nextMonth };
};

export const useCalendarStore = (id) =>
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

export const getData = async (selectedUser, selectedMonth, monthTime) => {

  monthTime.clear()
  selectedMonth.calculatedWorkTime = 0;
  selectedMonth.calculatedOvertimeTime = 0;

  let calculatedWorkTime = 0;
  let calculatedOvertimeTime = 0;

  try {
    const shifts = await getUserShifts(selectedUser.user._id, selectedMonth.month);
    const overtimes = await getOvertime(selectedUser.user._id, selectedMonth.month);

    const getDate = (dateTimeStr) => dateTimeStr.split('T')[0];

    const groupedShifts = shifts.reduce((acc, shift) => {
      const date = getDate(shift.start);
      if (!acc[date]) {
        acc[date] = {
          list: [],
          totalWork: 0,
          overtime: {}
        };
      }
      acc[date].list.push(shift);
      acc[date].totalWork += shift.work;
      const matchedOvertime = overtimes.filter(overtime => getDate(overtime.date) === date)[0];
      acc[date].overtimeTaken = matchedOvertime ? matchedOvertime : null;
      return acc;
    }, {});

    Object.keys(groupedShifts).forEach(date => {

      const totalWork = groupedShifts[date].totalWork;
      const splitOvertime = monthTime.splitOvertime(totalWork);

      calculatedWorkTime += splitOvertime.work;
      calculatedOvertimeTime += splitOvertime.overtime;

      if (groupedShifts[date].overtimeTaken){
        const ovTaken = (groupedShifts[date].overtimeTaken.hours || 0) * 3600;
        calculatedOvertimeTime -= ovTaken
      }

      groupedShifts[date].regular = splitOvertime.work;
      groupedShifts[date].overtime = splitOvertime.overtime;

    });

    selectedMonth.updateDaysInMonth()

    selectedMonth.daysInMonth = selectedMonth.daysInMonth.map(day => {
      const formattedDate = format(day.date, 'yyyy-MM-dd');
      const groupedShift = groupedShifts[formattedDate] || { list: [], regular: 0, overtimeTaken: null};
      return {
        ...day,
        shifts: groupedShift,
      };
    });
    return true
  } catch (error) {
      console.error("Error fetching users:", error);
      return false
    }
};