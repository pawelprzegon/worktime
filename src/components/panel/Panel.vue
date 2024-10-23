<script setup>

import Calendar from "@/components/panel/Calendar.vue";

</script>

<template>

  <div class="shifts">
   <Calendar />
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