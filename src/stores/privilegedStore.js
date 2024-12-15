import {ref} from "vue";
import {defineStore} from "pinia";

export const usePrivilegedSelectedUser = defineStore('usePrivilegedSelectedUser', () => {
  const user = ref(null);

  const setUser = (newUser) => {
    user.value = newUser;
  };

  return {
    user,
    setUser
  };
});
