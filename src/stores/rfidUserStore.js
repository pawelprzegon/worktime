import {defineStore} from "pinia";
import {ref} from "vue";
import {deleteWaitRFIDUser, getWaitRFIDUser, setWaitRFIDUser} from "@/composables/fetchers.js";


export const useWaitRFIDUserStore = defineStore('rfidUser', () => {
  const activeRFIDUser = ref(null);

  const setActiveRFIDUser = (activeUser) => {
    activeRFIDUser.value = activeUser;
  };

  const setWaitRfidUser = async (selectedUser) => {
    try{
      const response = await setWaitRFIDUser(selectedUser)
      await getWaitRfidUser()
      return response
    }
    catch (error) {
      console.log(error)
      throw error
    }
  }

  const getWaitRfidUser = async () => {
    try {
      const response = await getWaitRFIDUser()
      setActiveRFIDUser(response?.message || null)
    } catch (error){
      console.log(error)
      throw error
    }
  }

  const deleteWaitRfidUser = async () => {
    try {
      return await deleteWaitRFIDUser();
    } catch (error) {
      console.error(error);
      throw error
    }
  }

  return {
    activeRFIDUser,
    setWaitRfidUser,
    getWaitRfidUser,
    setActiveRFIDUser,
    deleteWaitRfidUser
  };
});