<script setup>

import {usePrivilegedSelectedUser} from "@/stores/privilegedStore.js";
import DetailsContainer from "@/components/pages/userPanel/DetailsContainer.vue";
import {updateUser} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";

const selectedUser = usePrivilegedSelectedUser();
const alert = useAlertStore()

const disableAccountToggle = () => {
  const data = JSON.stringify({
    "disabled": !selectedUser.user.disabled,
    "role": "user",
    "avatar": "default.png"
  })
  try {
    const result = updateUser(data, selectedUser.user.id)
    alert.show(result.status, result.message)
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
    <DetailsContainer :label="'username'" :data="selectedUser.user.username"/>
    <DetailsContainer :label="'email'" :data="selectedUser.user.email"/>
<!--    <DetailsContainer :label="'role'" :data="selectedUser.user.role"/>-->

    <div class="flex flex-row justify-between">
      <label for="checked-checkbox"
             class="
             portrait-2xs:text-3xs portrait-2xs:p-[1px] portrait-2xs:m-[1px]
             portrait-xs:text-2xs portrait-xs:p-[2px] portrait-xs:m-[2px]
             portrait-small:text-2xs portrait-small:p-[2px] portrait-small:m-[2px]
             portrait-medium:text-xs
             portrait-large:text-base
             portrait-xl:text-base"
      >user:
      </label>

      <input
             :checked="selectedUser.user.role === 'user'"
             @change="disableAccountToggle"
             id="checked-checkbox"
             type="checkbox"
             value=""
             class="
             w-4 h-4 my-auto text-blue-600 bg-gray-100 border-gray-300 rounded
             focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
             focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      >

      <label for="checked-checkbox"
             class="
             portrait-2xs:text-3xs portrait-2xs:p-[1px] portrait-2xs:m-[1px]
             portrait-xs:text-2xs portrait-xs:p-[2px] portrait-xs:m-[2px]
             portrait-small:text-2xs portrait-small:p-[2px] portrait-small:m-[2px]
             portrait-medium:text-xs
             portrait-large:text-base
             portrait-xl:text-base"
      >admin:
      </label>

      <input
             :checked="selectedUser.user.role === 'admin'"
             @change="disableAccountToggle"
             id="checked-checkbox"
             type="checkbox"
             value=""
             class="
             w-4 h-4 my-auto text-blue-600 bg-gray-100 border-gray-300 rounded
             focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
             focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      >
    </div>

    <div class="flex flex-row justify-between">
      <label for="checked-checkbox"
             class="
             portrait-2xs:text-3xs portrait-2xs:p-[1px] portrait-2xs:m-[1px]
             portrait-xs:text-2xs portrait-xs:p-[2px] portrait-xs:m-[2px]
             portrait-small:text-2xs portrait-small:p-[2px] portrait-small:m-[2px]
             portrait-medium:text-xs
             portrait-large:text-base
             portrait-xl:text-base"
      >account disabled:
      </label>

      <input
             :checked="selectedUser.user.disabled"
             @change="disableAccountToggle"
             id="checked-checkbox"
             type="checkbox"
             value=""
             class="
             w-4 h-4 my-auto text-blue-600 bg-gray-100 border-gray-300 rounded
             focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
             focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      >
    </div>
  </div>

</template>

<style scoped>

</style>