<script setup>

import {getUserShifts} from "@/fetchers.js";
import {ref, onMounted} from "vue";
import ShiftDetail from "@/components/panel/ShiftDetail.vue";

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

  <div class="shifts">
   <ShiftDetail
       v-for="shift in shifts"
       :shift="shift"
   />
  </div>

</template>

<style scoped>

.shifts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin: 1rem;

}

</style>