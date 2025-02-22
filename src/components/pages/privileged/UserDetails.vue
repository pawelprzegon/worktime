<script setup>

import {usePrivilegedAllUsers, usePrivilegedSelectedUser} from "@/stores/privilegedStore.js";
import DetailsContainer from "@/components/pages/userPanel/DetailsContainer.vue";
import {updateUser} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import CustomTextButton from "@/components/CustomTextButton.vue";
import {reactive, ref, watch} from "vue";
import {useWaitRFIDUserStore} from "@/stores/rfidUserStore.js";

const selectedUser = usePrivilegedSelectedUser();
const usersList = usePrivilegedAllUsers();
const alert = useAlertStore()
const waitRFIDUser = useWaitRFIDUserStore()

const isEditVisible = ref(false)

const user = reactive({
  email: null,
  username: null,
  disabled: null,
  role: null,
  rfid: null
});

const AddRFID = async () => {
  try{
    const result = await waitRFIDUser.setWaitRfidUser(selectedUser.user.id)
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

const cancelChanges = () => {
  isEditVisible.value = false
}

</script>

<template>

  <div
      v-if="selectedUser.user"
      class="w-8/12"
  >
    <div class="border rounded-md border-silver">

      <div
          v-if="!isEditVisible"
          class="p-2"
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
          label="edit"
          :fontSize="12"
          @click="editVisible"
        />
      </div>

      <div class="grid justify-items-center p-1 w-full">



      <div v-show="isEditVisible">

        <label class="block mb-2">Email:</label>
        <input v-model="user.email" type="email" class="input p-1" placeholder="Email" />

        <label class="block mt-3 mb-2">User name:</label>
        <input v-model="user.username" type="text" class="input p-1" placeholder="User name" />

        <label class="block mt-3 mb-2">Status:</label>
        <select v-model="user.disabled" class="input p-1">
          <option :value="true">Disabled</option>
          <option :value="false">Enabled</option>
        </select>

        <label class="block mt-3 mb-2">Role:</label>
        <select v-model="user.role" class="input p-1">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <label class="block mt-3 mb-2">RFID:</label>
        <input v-model="user.rfid" type="text" class="input p-1" placeholder="Kod RFID" />

        <div class="grid grid-rows-2 justify-items-center p-1 w-full">

          <CustomTextButton
            label="save"
            :fontSize="12"
            @click="saveChanges"
          />

          <CustomTextButton
            label="cancel"
            :fontSize="12"
            @click="cancelChanges"
          />

        </div>



      </div>

    </div>

    </div>

    <div class="grid justify-items-center p-1 w-full">
      <CustomTextButton
          label="add RFID"
          :fontSize="12"
          @click="AddRFID"
      />
    </div>

  </div>

</template>

<style scoped>

</style>