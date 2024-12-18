import {ref} from "vue";
import {defineStore} from "pinia";

export const useActiveShifts = defineStore('activeShifts', () => {
  const activeShifts = ref(null);

  const setActiveShifts = (activeShiftsList) => {
    activeShifts.value = activeShiftsList;
  };

  return {
    activeShifts,
    setActiveShifts
  };
});
