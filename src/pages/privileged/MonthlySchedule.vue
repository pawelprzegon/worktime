<script setup>
import "jspdf-autotable";
import {onMounted, watch} from "vue";
import {useSelectedUser, useSelectedMonth} from "@/stores/privilegedStore.js";
import {generatePDF} from "@/composables/pdfScheduleHandler.js";
import {getData} from "@/composables/privilegedHandler.js";
import ScheduleTable from "@/pages/privileged/ScheduleTable.vue";
import CalendarNavigation from "@/components/calendarNav/CalendarNavigation.vue";


const selectedUser = useSelectedUser();
const selectedMonth = useSelectedMonth();

watch(
  () => selectedUser.user, () => {
    getData(selectedUser, selectedMonth);
  },
  { deep: true }
);

onMounted(() => {
  if (selectedUser.user) {
    getData(selectedUser, selectedMonth);
  }
});

</script>

<template>
  <div v-if="selectedUser.user" class="schedule-container">
    <button @click="generatePDF(selectedUser, selectedMonth)">Get Schedule</button>
    <CalendarNavigation />
    <ScheduleTable/>
  </div>
</template>

<style scoped>
.schedule-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
