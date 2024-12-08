<script setup>

import {ref} from 'vue'
import {getUsers} from "@/fetchers.js";
import PDFgenerator from "@/pages/privileged/PDFgenerator.vue";

const users = ref([])
const selectedUser = ref(null)

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
        @click="selectedUser = user"
    >
      {{user.first_name}} {{user.last_name}}
    </p>

    <PDFgenerator :user="selectedUser" />

  </div>
</div>
</template>

<style scoped>

</style>