<script setup>

import {ref} from 'vue'
import {getUsers} from "@/fetchers.js";
import PDFgenerator from "@/pages/privileged/PDFgenerator.vue";
import SelectList from "@/components/SelectList.vue";

const users = ref([])


const usersList = async () => {
  users.value = await getUsers()
}

usersList()

</script>

<template>

    <SelectList
        label="Pick user"
        :data-list="users"
    />

    <PDFgenerator/>

</template>

<style scoped>

</style>