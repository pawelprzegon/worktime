import {add, addDays, endOfMonth, getDay, startOfMonth, sub} from "date-fns";
import {usedayStore} from "@/stores/calendarStore.js";

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

export const getLastCorrectionUpdate = (shift) => {
  if (shift.update.length > 0) {
    const lastUpdate = shift.update[shift.update.length - 1];
    return { ...lastUpdate };
  }
  return {};
};

export const getLast = (day) => {
  let shifts = []
  day.shifts.list.forEach(shift => {
    const lastCorrectionUpdate = getLastCorrectionUpdate(shift)
    if (Object.keys(lastCorrectionUpdate).length > 0){
      shifts.push(lastCorrectionUpdate)
    } else {
      shifts.push(shift)
    }

  })
  return shifts
}

export const useCalendarDays = (monthStore) => {

  const getAdjustedDay = (date) => {
    const day = date.getDay();
    return day === 0 ? 7 : day;
  };

  const getDaysBefore = () => {
    const firstDayOfMonth = startOfMonth(monthStore.selected.month);
    const startDay = getAdjustedDay(firstDayOfMonth);
    return range(2, startDay).map((_, index) =>
      addDays(firstDayOfMonth, -(startDay - index))
    );
  };

  const getDaysAfter = () => {
    const lastDayOfMonth = endOfMonth(monthStore.selected.month);
    const endDay = getAdjustedDay(lastDayOfMonth);
    const daysToAdd = 7 - endDay;
    return range(2, daysToAdd + 1).map((_, index) =>
      addDays(lastDayOfMonth, index + 1)
    );
  };

  return { getDaysBefore, getDaysAfter };
};

export const useCalendarNavigation = (monthStore, updateHandler) => {
  const prevMonth = () => {
    monthStore.selected.month = sub(monthStore.selected.month, { months: 1 });
    monthStore.updateDaysInMonth();
    updateHandler();
  };

  const nextMonth = () => {
    monthStore.selected.month = add(monthStore.selected.month, { months: 1 });
    monthStore.updateDaysInMonth();
    updateHandler();
  };

  return { prevMonth, nextMonth };
};

export const getTimeString = (datetime) => {
  const newDate = new Date(datetime);
  const hours = String(newDate.getHours()).padStart(2, '0');
  const minutes = String(newDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getDateString = (datetime) => {
  const newDate = new Date(datetime);
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const combineDateWithTime = (date, timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const resultDate = new Date(date);
  resultDate.setHours(hours, minutes, 0, 0);
  return resultDate;
}

export const splitTime = (shiftTime) => {
  const basic_work_time = 28800
  const regular_seconds = Math.min(shiftTime, basic_work_time)
  const overtimes_seconds = Math.max(shiftTime - basic_work_time, 0)
  return {regular: regular_seconds, overtime: overtimes_seconds};
};


export const checkShiftLessThan28800 = (shiftDt) => {
  const dayStore = usedayStore()

  const differenceInMilliseconds = shiftDt.stop.getTime() - shiftDt.start.getTime();
  const differenceInSeconds = differenceInMilliseconds / 1000;
  return (dayStore.toil.value?.duration_seconds || 0) + differenceInSeconds <= 28800;

}