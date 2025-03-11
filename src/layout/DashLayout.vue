<script setup>
import { getActiveShifts, getDashUsers } from "@/composables/fetchers.js";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import UserCard from "@/components/dash/UserCard.vue";
import { useActiveShifts } from "@/stores/shiftStore.js";
import Alert from "@/components/Alert.vue";
import UserCard2 from "@/components/dash/UserCard2.vue";

const activeShifts = useActiveShifts();
const users = ref([]);
const intervalId = ref(null);

const activeUsers = computed(() => users.value.filter(user => !user.disabled));

const checkActiveShift = async () => {
  try {
    const activeShiftsList = await getActiveShifts();

    if (activeShiftsList) {
      activeShifts.setActiveShifts(activeShiftsList);
    } else {
      activeShifts.setActiveShifts([])
    }
  } catch (error) {
    console.error("Error fetching getActiveShifts:", error);
  }
};

onMounted(async () => {
  try {
    users.value = await getDashUsers();
    await checkActiveShift();

    intervalId.value = setInterval(async () => {
      await checkActiveShift();
    }, 5000);
  } catch (error) {
    console.error("Error fetching users and active shifts:", error);
  }
});

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<template>
  <Alert/>

  <div class="grid [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-4">

    <UserCard2
        v-for="user in activeUsers"
        :key="user.id"
        :user="user"
        :check-active-shift="checkActiveShift"
    />

  </div>


</template>

<style scoped>

</style>