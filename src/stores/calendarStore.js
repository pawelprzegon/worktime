import {ref} from "vue";
import {defineStore} from "pinia";
import {deleteShiftFetch} from "@/composables/fetchers.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {getDateString, getHoursAsNumber} from "@/composables/utils.js";


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
      toil: newDay.toil,
    };
  };

  const updateDay = () => {
    const day = monthStore.selected.days.find(d => d.date.getTime() === date.value?.getTime());

    if (day) {
      selectedDay.value = {
        shiftsList: day.list,
        regular: day.regular,
        overtime: day.overtime,
        toil: day.toil,
      };
    }
  };

  const getShift = (shiftId) => {
    return selectedDay.value.shiftsList.filter((shift) => shift.id === shiftId)[0];
  }

  const removeShift = async (shiftId) => {
    try {
      const response = await deleteShiftFetch(shiftId);
      if (response.status === 'success') {
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


export const useAdderShiftStore = defineStore('adderShift', () => {
  const monthStore = useSelectedMonthStore('calendar');
  const dailyShifts = useDailyShiftsList()

  const hoursPool = ref(getHoursAsNumber(monthStore.selected.monthlyOvertime));
  const dt = getDateString(dailyShifts.date)
  const maxToTake = ref(0);  // Inicjalizacja z jakąś wartością

  const toil = ref({
    id: dailyShifts.selectedDay.toil?.id || null,
    duration_seconds: dailyShifts.selectedDay.toil?.duration_seconds || 0,
  });

  const counter = ref(toil.value.duration_seconds / 3600);

  const increment = () => {
    console.log('increment')
    // Sprawdzamy czy maxToTake i hoursPool mają poprawne wartości
    if (counter.value < maxToTake.value && counter.value < hoursPool.value) {
      counter.value += 1;
      hoursPool.value--;
    }
  };

  const decrement = () => {
    if (counter.value > 0) {
      counter.value -= 1;
      hoursPool.value++;
    }
  };

  const shift = ref({
    start: '00:00',
    stop: '00:00',
    note: '',
  });

  const calculateMaxToTake = ref({});

  const setStart = (newStart) => {
    shift.value.start = newStart;
    calculateMaxToTake(dt);
  };

  const setStop = (newStop) => {
    shift.value.stop = newStop;
    calculateMaxToTake(dt);
  };

  const setToil = (newToil) => {
    toil.value = newToil;
    calculateMaxToTake(dt);
  };

  return {
    hoursPool,
    dt,
    maxToTake,
    counter,
    shift,
    toil,
    setStart,
    setStop,
    setToil,
    increment,
    decrement,
    calculateMaxToTake,
  };
});