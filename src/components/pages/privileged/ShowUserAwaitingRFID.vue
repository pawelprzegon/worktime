<script setup>

import {onMounted, ref} from "vue";
import {deleteWaitRFIDUser, getWaitRFIDUser} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import CustomTextButton from "@/components/CustomTextButton.vue";

const alert = useAlertStore()

const waitingUser = ref(null)

const clearWaitingRFIDUser = async () => {

  try {
    const response = await deleteWaitRFIDUser()
    alert.show('success', response.message)
  } catch (error){
    console.log(error)
    alert.show('error', error.details)
  }
}

onMounted(async () => {
  try {
    waitingUser.value = await getWaitRFIDUser()
  } catch (error){
    console.log(error)
    alert.show('error', error.details)
  }


})
</script>

<template>

 <p
     v-show="waitingUser"
     class="text-base text-white m-1"
 >
   {{waitingUser.value}}
 </p>

  <CustomTextButton
      label="remove"
      @click="clearWaitingRFIDUser"
  />

</template>

<style scoped>

</style>