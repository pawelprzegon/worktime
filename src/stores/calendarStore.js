import {ref} from "vue";
import {defineStore} from "pinia";
import {deleteShiftFetch} from "@/composables/fetchers.js";

export const useDailyShiftsList = defineStore('dailyShiftsList', () => {
  const date = ref(null)
  const shiftsList = ref(null);
  const dailyRegular = ref(null);
  const dailyOvertime = ref(null);


  const setDay = (newDay) => {
    date.value = newDay.date
    shiftsList.value = newDay.shifts.list;
    dailyRegular.value = newDay.shifts.regular
    dailyOvertime.value = newDay.shifts.overtime
  };

  const calculateShiftRegularOvertime = () => {
    shiftsList.value.forEach(shift => {

    })
  }

  const getShift = (shiftId) => {
    return shiftsList.value.filter((shift) => shift.id === shiftId)[0];
  }

  const removeShift = async (shiftId) => {
    try {
      const response = await deleteShiftFetch(shiftId);
      if (response) {
        shiftsList.value = shiftsList.value.filter(
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
    shiftsList,
    dailyRegular,
    dailyOvertime,
    setDay,
    getShift,
    removeShift
  };
});
