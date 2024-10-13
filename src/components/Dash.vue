<script setup>
import {getUsers} from "@/fetchers.js";
import {onMounted, ref} from "vue";
import DashUser from "@/components/DashUser.vue";

const users = ref([])

onMounted(async () => {
  try {
    users.value = await getUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});
</script>

<template>
  <div v-for="user in users">
    <DashUser
       :user="user"
    />
  </div>

</template>

<style scoped>

</style>