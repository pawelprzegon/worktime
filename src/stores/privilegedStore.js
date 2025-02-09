import {ref} from "vue";
import {defineStore} from "pinia";
import {getUsers} from "@/composables/fetchers.js";

export const usePrivilegedSelectedUser = defineStore('usePrivilegedSelectedUser', () => {
  const user = ref(null);

  const setUser = (id) => {
    const usersList = usePrivilegedAllUsers();
    const matchedUser = usersList.users.find(usr => usr.id === id);
    if (matchedUser) {
      user.value = matchedUser;
    }
  };

  return {
    user,
    setUser
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
