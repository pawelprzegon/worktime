<script setup>
import {useAuthStore} from "@/stores/authStore.js";
import {updateUser} from "@/composables/fetchers.js";
import {reactive, ref} from "vue";
import EditUserDataForm from "@/components/forms/EditUserDataForm.vue";
import {useAlertStore} from "@/stores/alertStore.js";

const alert = useAlertStore()
const apiURL = import.meta.env.VITE_APP_API_URL
const authStore = useAuthStore();

const isEditVisible = ref(false)

const user = reactive({
  email: authStore.user.email,
  username: authStore.user.username,
  first_name: authStore.user.firstName,
  last_name: authStore.user.lastName,
});

const updateUserData = async () => {
  const data = JSON.stringify(user)
  try {
    const result = await updateUser(data, authStore.user.id)

    if (result) {

      alert.show(result.status, result.message)
      isEditVisible.value = false
      authStore.getUserMetadata()

    }

  } catch (error) {
    alert.show(error.status, error.message)
  }
}

</script>

<template>

  <div class="grid grid-flow-row justify-start">

    <div class="flex flex-col bg-white rounded-lg shadow-sm md:flex-row md:max-w-xl dark:bg-primary">
      <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" :src="`${apiURL}/${authStore.user.avatar}`" alt="userAvatar">
      <div class="flex flex-col gap-1 px-4 leading-normal">
        <h2 class="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{{authStore.user.firstName}} {{authStore.user.lastName}}</h2>
        <p class="font-bold dark:text-white">email:<small class="ms-2 text-lg font-semibold text-blue-500 dark:text-blue-400">{{authStore.user.email}}</small></p>
        <p class="font-bold dark:text-white">role:<small class="ms-2 text-lg font-semibold text-blue-500 dark:text-blue-400">{{authStore.user.role}}</small></p>
        <p class="font-bold dark:text-white">username:<small class="ms-2 text-lg font-semibold text-blue-500 dark:text-blue-400">{{authStore.user.username}}</small></p>
        <p class="font-bold dark:text-white">account status:<small class="ms-2 text-lg font-semibold text-blue-500 dark:text-blue-400">{{ authStore.user.disabled ? "disabled" : "active" }}</small></p>
        <button type="button" class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:ring-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Edit</button>
      </div>
    </div>

    <div class="mt-5">
      <EditUserDataForm
          :handle-submit="updateUserData"
          :form="user"
          :excluded-fields="{ password: true, confirmedPassword: true }"
      />

    </div>


  </div>



</template>

<style scoped>

</style>