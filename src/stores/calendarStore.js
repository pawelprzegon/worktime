import {ref} from "vue";
import {defineStore} from "pinia";
import {deleteShiftFetch} from "@/composables/fetchers.js";

export const useCalendarSelectedDay = defineStore('calendarSelectedDay', () => {
  const day = ref(null);

  const setDay = (newUser) => {
    day.value = newUser;
  };

  const getShift = (shiftId) => {
    return day.value.shifts.list.filter((shift) => shift.id === shiftId)[0];
  }

  const removeShift = async (shiftId) => {
    try {
      const response = await deleteShiftFetch(shiftId);
      if (response) {
        day.value.shifts.list = day.value.shifts.list.filter(
          (shift) => shift.id !== shiftId
        );
      }
      return {status: response.status, message: response.message}

    } catch (error) {
      console.error("Error removing shift:", error);
      return {status: 'error', message: 'Removing shift failed!'}
    }
  };

  return {
    day,
    setDay,
    getShift,
    removeShift
  };
});
