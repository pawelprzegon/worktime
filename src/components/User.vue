<script setup>

import {getUserShifts} from "@/fetchers.js";
import {ref, onMounted} from "vue";

const shifts = ref([])

onMounted(async () => {
  try {
    shifts.value = await getUserShifts()

  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

</script>

<template>

  <p
      v-for="shift in shifts"
      class="shifts"
  >
   {{shift}}
  </p>

</template>

<style scoped>

</style>