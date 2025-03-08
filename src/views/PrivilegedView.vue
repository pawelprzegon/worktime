<script setup>

import SelectList from "@/components/privileged/SelectList.vue";
import MonthlySchedule from "@/components/privileged/MonthlySchedule.vue";
import UserDetails from "@/components/privileged/UserDetails.vue";
import ShowUserAwaitingRFID from "@/components/privileged/ShowUserAwaitingRFID.vue";
import Alert from "@/components/Alert.vue";
import Banner from "@/components/Banner.vue"
import {usePrivilegedSelectedUser} from "@/stores/privilegedStore.js";

const selectedUser = usePrivilegedSelectedUser()

</script>

<template>
    <Alert/>
    <ShowUserAwaitingRFID/>
    <SelectList
        label="Pick user"
    />
    <Banner
        v-if="selectedUser.user?.disabled"
        :main-text="'Account Disabled'"
    />

  <div class="grid grid-cols-[2fr_1fr] justify-items-center py-4">

    <MonthlySchedule/>
    <UserDetails/>
  </div>


</template>

<style scoped>

</style>