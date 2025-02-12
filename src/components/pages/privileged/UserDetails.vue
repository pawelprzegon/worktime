<script setup>

import {usePrivilegedAllUsers, usePrivilegedSelectedUser} from "@/stores/privilegedStore.js";
import DetailsContainer from "@/components/pages/userPanel/DetailsContainer.vue";
import {rfidUserWaiting, updateUser} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import CustomTextButton from "@/components/CustomTextButton.vue";
import {reactive, ref} from "vue";

const selectedUser = usePrivilegedSelectedUser();
const usersList = usePrivilegedAllUsers();
const alert = useAlertStore()

const isEditVisible = ref(false)

const user = reactive({
  email: null,
  username: null,
  disabled: null,
  role: null,
  rfid: null
});

const AddChangeRFID = async () => {
  try{
    const result = await rfidUserWaiting(selectedUser.user.id)
    console.log(result.status)
    console.log(result.message)
    alert.show('success', result.message)
  }
  catch (error) {
    alert.show(error.status, error.message)
  }
}

const editVisible = () => {
  user.email = selectedUser.user.email
  user.username = selectedUser.user.username
  user.role = selectedUser.user.role
  user.disabled = selectedUser.user.disabled
  user.rfid = selectedUser.user.rfid

  isEditVisible.value = true
}

const saveChanges = async () => {
  const data = JSON.stringify(user)
  try {
    const result = await updateUser(data, selectedUser.user.id)
    alert.show(result.status, result.message)
    isEditVisible.value = false
    await usersList.loadUsers()
    selectedUser.setUser(selectedUser.user.id);
  } catch (error) {
    alert.show(error.status, error.message)
  }
}

</script>

<template>

  <div
      v-if="selectedUser.user"
      class="w-8/12"
  >
    <p class="m-1 text-base text-white">User details:</p>
    <DetailsContainer :label="'firstname'" :data="selectedUser.user.first_name"/>
    <DetailsContainer :label="'lastname'" :data="selectedUser.user.last_name"/>
    <DetailsContainer :label="'email'" :data="selectedUser.user.email"/>
    <DetailsContainer :label="'username'" :data="selectedUser.user.username"/>
    <DetailsContainer :label="'role'" :data="selectedUser.user.role"/>
    <DetailsContainer :label="'RFID'" :data="selectedUser.user.rfid"/>
    <DetailsContainer :label="'account disabled'" :data="selectedUser.user.disabled? 'Yes' : 'No' "/>

    <CustomTextButton
        label="add / change RFID"
        :fontSize="12"
        @click="AddChangeRFID"
    />

    <CustomTextButton
        label="edit"
        :fontSize="12"
        @click="editVisible"
    />

    <div v-show="isEditVisible">

      <label class="block mb-2">Email:</label>
      <input v-model="user.email" type="email" class="input" placeholder="Email" />

      <label class="block mt-3 mb-2">Nazwa użytkownika:</label>
      <input v-model="user.username" type="text" class="input" placeholder="Nazwa użytkownika" />

      <label class="block mt-3 mb-2">Status:</label>
      <select v-model="user.disabled" class="input">
        <option :value="true">Nieaktywny</option>
        <option :value="false">Aktywny</option>
      </select>

      <label class="block mt-3 mb-2">Rola:</label>
      <select v-model="user.role" class="input">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <label class="block mt-3 mb-2">RFID:</label>
      <input v-model="user.rfid" type="text" class="input" placeholder="Kod RFID" />

      <CustomTextButton
        label="save"
        :fontSize="12"
        @click="saveChanges"
      />

    </div>

  </div>

</template>

<style scoped>

</style>