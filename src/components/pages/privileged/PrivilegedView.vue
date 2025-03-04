<script setup>

import SelectList from "@/components/pages/privileged/SelectList.vue";
import MonthlySchedule from "@/components/pages/privileged/MonthlySchedule.vue";
import UserDetails from "@/components/pages/privileged/UserDetails.vue";
import ShowUserAwaitingRFID from "@/components/pages/privileged/ShowUserAwaitingRFID.vue";
import Alert from "@/components/Alert.vue";
import EditUser from "@/components/pages/privileged/EditUser.vue";


</script>

<template>
    <Alert/>
    <ShowUserAwaitingRFID/>
    <SelectList
        label="Pick user"
    />

  <div class="grid grid-cols-[2fr_1fr] justify-items-center">

    <MonthlySchedule/>
    <div>
      <UserDetails/>
      <EditUser/>
    </div>


  </div>


</template>

<style scoped>

</style>