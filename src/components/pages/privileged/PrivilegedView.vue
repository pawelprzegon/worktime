<script setup>

import SelectList from "@/components/pages/privileged/SelectList.vue";
import MonthlySchedule from "@/components/pages/privileged/MonthlySchedule.vue";
import UserDetails from "@/components/pages/privileged/UserDetails.vue";
import Alert from "@/components/Alert.vue";

</script>

<template>
    <Alert/>
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