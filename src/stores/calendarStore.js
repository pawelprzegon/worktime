import {ref} from "vue";
import {defineStore} from "pinia";
import {deleteShiftFetch} from "@/composables/fetchers.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";



export const useDailyShiftsList = defineStore('dailyShiftsList', () => {

  const monthStore = useSelectedMonthStore('calendar');
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
      shiftsList: newDay.list,
      regular: newDay.regular,
      overtime: newDay.overtime,
      toil: newDay.toilTaken,
    };
  };

  const updateDay = () => {
    const day = monthStore.selected.days.find(d => d.date.getTime() === date.value?.getTime());

    if (day) {
      selectedDay.value = {
        shiftsList: day.list,
        regular: day.regular,
        overtime: day.overtime,
        toil: day.toilTaken,
      };
    }
  };

  const getShift = (shiftId) => {
    return selectedDay.value.shiftsList.filter((shift) => shift.id === shiftId)[0];
  }

  const removeShift = async (shiftId) => {
    try {
      const response = await deleteShiftFetch(shiftId);
      if (response) {
        selectedDay.value.shiftsList = selectedDay.value.shiftsList.filter(
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
    updateDay,
    setDay,
    getShift,
    removeShift
  };
});
