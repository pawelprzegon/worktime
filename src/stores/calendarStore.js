import {ref} from "vue";
import {defineStore} from "pinia";

export const useCalendarSelectedDay = defineStore('calendarSelectedDay', () => {
  const day = ref(null);

  const setDay = (newUser) => {
    day.value = newUser;
  };

  return {
    day,
    setDay
  };
});
