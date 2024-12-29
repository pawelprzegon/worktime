import {ref} from "vue";
import {defineStore} from "pinia";
import {deleteShiftFetch} from "@/composables/fetchers.js";

export const useDailyShiftsList = defineStore('dailyShiftsList', () => {
  const date = ref(null)

  const selectedDay = ref({
    shiftsList: null,
    regular: null,
    overtime: null,
    toil: null
  })


  const setDay = (newDay) => {
    date.value = newDay.date
    selectedDay.value = {
      shiftsList: newDay.shifts.list,
      regular: newDay.shifts.regular,
      overtime: newDay.shifts.overtime,
      toil: newDay.shifts.toilTaken,
    };
  };

  const getShift = (shiftId) => {
    return selectedDay.value.shiftsList.filter((shift) => shift.id === shiftId)[0];
  }

  const removeShift = async (shiftId) => {
    try {
      const response = await deleteShiftFetch(shiftId);
      if (response) {
        selectedDay.shiftsList = selectedDay.shiftsList.filter(
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
    date,
    selectedDay,
    setDay,
    getShift,
    removeShift
  };
});
