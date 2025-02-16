<script setup>

import {onMounted} from "vue";
import {useAlertStore} from "@/stores/alertStore.js";
import {useWaitRFIDUserStore} from "@/stores/rfidUserStore.js";
import CustomIconButton from "@/components/CustomIconButton.vue";

const alert = useAlertStore()
const waitRFIDUser = useWaitRFIDUserStore()

const clearWaitingRFIDUser = async () => {

  try {
    const response =  await waitRFIDUser.deleteWaitRfidUser();
    alert.show('success', response.message)
    waitRFIDUser.setActiveRFIDUser(null)
  } catch (error){
    console.log(error)
    alert.show('error', error.details)
  }
}

onMounted(() => {
  try {
    setInterval(async () => {
      await waitRFIDUser.getWaitRfidUser()
    }, 5000)
  } catch (error){
    console.log(error)
    alert.show('error', error.details)
  }
})

</script>

<template>

  <div
      v-if="waitRFIDUser.activeRFIDUser"
      class="flex flex-row justify-end align-middle bg-pink-900 rounded-md m-3"
  >

    <p class="text-base text-white m-1 place-content-center">
     {{waitRFIDUser.activeRFIDUser}}
   </p>

    <CustomIconButton
        icon="delete.png"
        @click="clearWaitingRFIDUser"
    />

  </div>

</template>

<style scoped>

</style>