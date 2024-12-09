<script setup>

import {ref} from 'vue'
import {getUsers} from "@/fetchers.js";
import MonthlySchedule from "@/pages/privileged/MonthlySchedule.vue";
import SelectList from "@/components/SelectList.vue";

const users = ref([])

const loadUsers = async () => {
  try {
    users.value = await getUsers()
  } catch (error) {
    console.error('Błąd podczas ładowania użytkowników:', error)
  }
}

loadUsers()

</script>

<template>

    <SelectList
        label="Pick user"
        :data-list="users"
    />

    <MonthlySchedule/>

</template>

<style scoped>

</style>