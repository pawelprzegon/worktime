<script setup>

import {ref} from 'vue'
import {getUsers} from "@/fetchers.js";
import PDFgenerator from "@/pages/privileged/PDFgenerator.vue";
import {useSelectedUser} from "@/stores/privileged.js";

const users = ref([])
const selectedUser = useSelectedUser()

const usersList = async () => {
  users.value = await getUsers()
}

usersList()

</script>

<template>
<div>
  <p>Privileged</p>
  <div>
    <p
        v-for="user in users"
        @click="selectedUser.setUser(user)"
    >
      {{user.first_name}} {{user.last_name}}
    </p>

    <PDFgenerator/>

  </div>
</div>
</template>

<style scoped>

</style>