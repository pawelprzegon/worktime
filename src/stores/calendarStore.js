import {computed, ref} from "vue";
import {defineStore} from "pinia";
import {setToil} from "@/composables/fetchers.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {getDateString} from "@/composables/utils.js";
import {useAuthStore} from "@/stores/authStore.js";


export const useDayStore = defineStore('dayStore', () => {

  const authStore = useAuthStore()
  const monthStore = useSelectedMonthStore('calendar');
  const date = ref(null);
  const list = ref([]);
  const regular = ref(0);
  const overtime = ref(0);
  const toil = ref({});


  const setDay = (newDay) => {
    date.value = newDay.date
    list.value = newDay.list
    regular.value = newDay.regular
    overtime.value = newDay.overtime
    toil.value = newDay.toil
  };

  const refresh = () => {
    const day = monthStore.selected.days.find(d => d.date.getTime() === date.value?.getTime());

    if (day) {
      list.value = day.list
      regular.value = day.regular
      overtime.value = day.overtime
      toil.value = day.toil
    }
  };

  // TOIL
  const maxToTake = computed(() => {
    let maxToil = overtime.value > 0 ? 0 : Math.floor((28800 - regular.value) / 3600);
    return maxToil + ((regular.value % 3600) !== 0 ? 1 : 0);
  });


  const saveToil = async (counter) => {

    const recalculatedCounterIntoSeconds = counter * 3600

    if (counter > maxToTake.value) {
      return {'status': 'warning', 'message': 'You picked higher amount of hours'}
    }

    if (recalculatedCounterIntoSeconds + regular.value > 32399) {
      return {'status': 'warning', 'message': 'Toil time with Shift time is higher than 8h Shift'}
    }

    try {
      const response = await setToil(authStore.user.id, toil.value.id, recalculatedCounterIntoSeconds, getDateString(date.value))
      await monthStore.refresh()
      await refresh()
      return {'status': response.status, 'message': response.message}
    } catch (error) {
      return {'status': 'error', 'message': error.message}
    }
  }

  // SHIFT
  const getShiftById = (shiftId) => {
    return computed(() => list.value.find(s => s.id === shiftId));
  }


  return {
    date,
    list,
    regular,
    overtime,
    toil,
    maxToTake,
    setDay,
    refresh,
    saveToil,
    getShiftById,
  };
});
