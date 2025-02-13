<script setup>

import {onMounted, ref} from "vue";
import {deleteWaitRFIDUser, getWaitRFIDUser} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import CustomTextButton from "@/components/CustomTextButton.vue";
import CustomIconButton from "@/components/CustomIconButton.vue";

const alert = useAlertStore()

const waitingUser = ref(null)

const clearWaitingRFIDUser = async () => {

  try {
    const response = await deleteWaitRFIDUser()
    alert.show('success', response.message)
    waitingUser.value = null
  } catch (error){
    console.log(error)
    alert.show('error', error.details)
  }
}

onMounted(async () => {
  try {
    const response = await getWaitRFIDUser()
    waitingUser.value = response?.message
  } catch (error){
    alert.show('error', error.details)
  }

})
</script>

<template>

  <div
      v-if="waitingUser"
      class="flex flex-row justify-end align-middle bg-pink-900 rounded-md m-3"
  >

    <p class="text-base text-white m-1 place-content-center">
     {{waitingUser}}
   </p>

    <CustomIconButton
        icon="delete.png"
        @click="clearWaitingRFIDUser"
    />

  </div>

</template>

<style scoped>

</style>