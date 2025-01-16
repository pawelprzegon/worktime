<script setup>

import {ref} from 'vue'
import {getUsers} from "@/composables/fetchers.js";
import SelectList from "@/pages/privileged/SelectList.vue";
import MonthlySchedule from "@/pages/privileged/MonthlySchedule.vue";
import UserDetails from "@/pages/privileged/UserDetails.vue";
import Alert from "@/components/Alert.vue";

const users = ref([])

const loadUsers = async () => {
  try {
    users.value = await getUsers()
  } catch (error) {
    console.error('Loading users error:', error)
  }
}

loadUsers()

</script>

<template>
    <Alert/>
    <SelectList
        label="Pick user"
        :data-list="users"
    />

  <div class="grid grid-cols-[2fr_1fr] justify-items-center">
    <MonthlySchedule/>
    <UserDetails/>
  </div>


</template>

<style scoped>

</style>