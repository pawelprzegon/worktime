import {ref} from "vue";
import {defineStore} from "pinia";
import {getUsers} from "@/composables/fetchers.js";

export const usePrivilegedSelectedUser = defineStore('usePrivilegedSelectedUser', () => {
  const user = ref(null);
  const shift = ref(null)

  const setUser = (id) => {
    const usersList = usePrivilegedAllUsers();
    const matchedUser = usersList.users.find(usr => usr.id === id);
    if (matchedUser) {
      user.value = matchedUser;
    }
  };

  const setShift = (id) => {
    shift.value = id
  }

  const clearShift = () => shift.value = null

  return {
    user,
    shift,
    setUser,
    setShift,
    clearShift
  };
});

export const usePrivilegedAllUsers = defineStore('usePrivilegedAllUsers', () => {
  const users = ref([]);

  const loadUsers = async () => {
    try {
      users.value = await getUsers()
    } catch (error) {
      console.error('Loading users error:', error)
    }
  }

  return {
    users,
    loadUsers
  };
});
