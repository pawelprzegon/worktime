import {ref} from "vue";
import {defineStore} from "pinia";

export const useActiveShifts = defineStore('activeShifts', () => {
  const activeShifts = ref([]);

  const setActiveShifts = (activeShiftsList) => {
    activeShifts.value = activeShiftsList;
  };

  return {
    activeShifts,
    setActiveShifts
  };
});

export const useActiveShift = defineStore('activeShift', () => {
  const shift = ref(null);

  const setShift = (newShift) => {
    shift.value = newShift;
  };

  return {
    shift,
    setShift
  };
});