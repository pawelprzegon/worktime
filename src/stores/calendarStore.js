import {ref} from "vue";
import {defineStore} from "pinia";
import {deleteShiftFetch} from "@/composables/fetchers.js";

export const useDailyShiftsList = defineStore('dailyShiftsList', () => {
  const shiftsList = ref(null);

  const setDay = (newDay) => {
    shiftsList.value = newDay;
  };

  const getShift = (shiftId) => {
    return shiftsList.value.shifts.list.filter((shift) => shift.id === shiftId)[0];
  }

  const removeShift = async (shiftId) => {
    try {
      const response = await deleteShiftFetch(shiftId);
      if (response) {
        shiftsList.value.shifts.list = shiftsList.value.shifts.list.filter(
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
    shiftsList,
    setDay,
    getShift,
    removeShift
  };
});
