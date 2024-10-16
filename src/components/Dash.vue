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
  <div class="dash-user-list">

    <DashUser
        v-for="user in users"
        :user="user"
    />

  </div>


</template>

<style scoped>

.dash-user-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;
  margin: 1rem;
}

</style>