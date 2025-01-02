<script setup>
import {getActiveShifts, getDashUsers} from "@/composables/fetchers.js";
import {onBeforeUnmount, onMounted, ref} from "vue";
import UserCard from "@/pages/dash/UserCard.vue";
import {useActiveShifts} from "@/stores/shiftStore.js";

const activeShifts = useActiveShifts()

const users = ref([])
const intervalId = ref(null);

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
    intervalId.value = setInterval(async () => {
    await checkActiveShift()
  }, 5000)
  } catch (error) {
    console.error("Error fetching users and active shifts:", error);
  }
});

onBeforeUnmount(() => {
  clearInterval(intervalId.value);
});
</script>

<template>

  <div class="grid [grid-template-columns:repeat(auto-fit,minmax(120px,1fr))] gap-4">

    <UserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
        :check-active-shift="checkActiveShift"
    />

  </div>


</template>

<style scoped>

</style>