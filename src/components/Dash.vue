<script setup>
import {getDashUsers} from "@/fetchers.js";
import {onMounted, ref} from "vue";
import User from "@/components/user/User.vue";

const users = ref([])

onMounted(async () => {
  try {
    users.value = await getDashUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
  }

});
</script>

<template>
  <div class="dash-user-list">

    <User
        v-for="user in users"
        :key="user.id"
        :user="user"
    />

  </div>


</template>

<style scoped>

.dash-user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin: 15px;
}

@media (max-width: 1300px) {
  .dash-user-list {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    margin: 5px;
  }
}

@media (max-width: 1000px) {
  .dash-user-list {
      grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
      margin: 5px;
    }
}

@media (max-width: 800px) {
  .dash-user-list {
    grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
    margin: 5px;
  }
}

@media (max-width: 600px) {
  .dash-user-list {
    grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
    margin: 5px;
  }
}

</style>