<script setup>

import SelectList from "@/components/privileged/SelectList.vue";
import MonthlySchedule from "@/components/privileged/MonthlySchedule.vue";
import UserDetails from "@/components/privileged/UserDetails.vue";
import ShowUserAwaitingRFID from "@/components/privileged/ShowUserAwaitingRFID.vue";
import Alert from "@/components/Alert.vue";

</script>

<template>
    <Alert/>
    <ShowUserAwaitingRFID/>
    <SelectList
        label="Pick user"
    />

  <div class="grid grid-cols-[2fr_1fr] justify-items-center">

    <MonthlySchedule/>
    <UserDetails/>
  </div>


</template>

<style scoped>

</style>