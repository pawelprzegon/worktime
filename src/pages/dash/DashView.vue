<script setup>
import {getActiveShifts, getDashUsers} from "@/composables/fetchers.js";
import {onMounted, ref} from "vue";
import User from "@/pages/dash/User.vue";
import {useActiveShifts} from "@/stores/shiftStore.js";

const activeShifts = useActiveShifts()

const users = ref([])

const checkActiveShift = async () => {
  try{
    const activeShiftsList = await getActiveShifts()
    if (activeShiftsList) {
      activeShifts.setActiveShifts(activeShiftsList)
    }

  } catch (error) {
    console.error("Error fetching getActiveSift:", error);
  }
}

onMounted(async () => {
  try {
    users.value = await getDashUsers();
    await checkActiveShift()
    setInterval(async () => {
      await checkActiveShift()
    }, 5000)
  } catch (error) {
    console.error("Error fetching users and active shifts:", error);
  }
});
</script>

<template>
  <div class="dash-user-list">

    <User
        v-for="user in users"
        :key="user.id"
        :user="user"
        :check-active-shift="checkActiveShift"
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