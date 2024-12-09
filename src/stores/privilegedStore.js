import {defineStore} from "pinia";
import {ref} from "vue";


export const useSelectedUser = defineStore('selectedUser', () => {
  const user = ref(null);

  const setUser = (newUser) => {
    user.value = newUser;
  };

  return {
    user,
    setUser
  };
});

export const useSelectedMonth = defineStore('selectedMonth', () => {
  const month = ref(new Date());

  const setMonth = (newMonth) => {
    month.value = newMonth;
  };

  return {
    month,
    setMonth
  };
});