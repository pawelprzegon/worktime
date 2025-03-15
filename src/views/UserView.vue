<script setup>
import {useAuthStore} from "@/stores/authStore.js";
import {updateUser} from "@/composables/fetchers.js";
import {reactive, ref} from "vue";
import EditUserDataForm from "@/components/forms/EditUserDataForm.vue";
import {useAlertStore} from "@/stores/alertStore.js";
import ChangeAvatar from "@/components/userPanel/ChangeAvatar.vue";

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

  <div class="grid grid-rows-[repeat(auto-fit,minmax(0,1fr))] gap-8">

    <div class="flex flex-col bg-white rounded-lg shadow-sm md:flex-row md:max-w-xl dark:bg-primary">
      <img class="object-cover w-full rounded-t-lg h-96 w-96 md:h-48 md:w-48 md:rounded-none md:rounded-s-lg" :src="`${apiURL}/${authStore.user.avatar}`" alt="userAvatar">
      <div class="flex flex-col gap-1 px-4 leading-normal">
        <h2 class="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{{authStore.user.firstName}} {{authStore.user.lastName}}</h2>
        <p class="font-bold dark:text-white">email:<small class="ms-2 text-lg font-semibold text-blue-500 dark:text-blue-400">{{authStore.user.email}}</small></p>
        <p class="font-bold dark:text-white">role:<small class="ms-2 text-lg font-semibold text-blue-500 dark:text-blue-400">{{authStore.user.role}}</small></p>
        <p class="font-bold dark:text-white">username:<small class="ms-2 text-lg font-semibold text-blue-500 dark:text-blue-400">{{authStore.user.username}}</small></p>
        <p class="font-bold dark:text-white">account status:<small class="ms-2 text-lg font-semibold text-blue-500 dark:text-blue-400">{{ authStore.user.disabled ? "disabled" : "active" }}</small></p>

      </div>
    </div>

    <div>


      <div class="grid grid-rows-2 gap-2">
        <div>
          <h1 class="text-xl font-bold dark:text-white">Change your data</h1>
          <EditUserDataForm
              class="bg-white dark:bg-neutral-900 rounded-md p-8 w-full"
              :handle-submit="updateUserData"
              :form="user"
              :excluded-fields="{ password: true, confirmedPassword: true }"
          />
        </div>
        <div>
          <h1 class="text-xl font-bold dark:text-white">Change your avatar</h1>
          <ChangeAvatar
            class="bg-white dark:bg-neutral-900 rounded-md p-8 w-full"
          />
        </div>

      </div>
    </div>


  </div>



</template>

<style scoped>

</style>