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

export const useDateShifts = defineStore('dateShifts', () => {
  const shifts = ref([]);

  const setShifts = (newShifts) => {
    shifts.value = newShifts;
  };

  return {
    shifts,
    setShifts
  };
});