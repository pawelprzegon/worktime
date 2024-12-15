<script setup>
import "jspdf-autotable";
import {onMounted, ref, watch} from "vue";
import {usePrivilegedSelectedUser, usePrivilegedSelectedMonth} from "@/stores/privilegedStore.js";
import {generatePDF} from "@/composables/pdfScheduleHandler.js";
import {getData} from "@/composables/privilegedHandler.js";
import ScheduleTable from "@/pages/privileged/ScheduleTable.vue";
import CalendarNavigation from "@/components/calendarNav/CalendarNavigation.vue";
import {useCalendarNavigation} from "@/utils.js";
import Spinner from "@/components/Spinner.vue";
import Alert from "@/components/Alert.vue";


const selectedUser = usePrivilegedSelectedUser();
const selectedMonth = usePrivilegedSelectedMonth();
const isLoading = ref(false)


const getDataHandler = async () => {
  isLoading.value = true;
  const result = await getData(selectedUser, selectedMonth);
  isLoading.value = !result;
};

const { prevMonth, nextMonth } = useCalendarNavigation(selectedMonth, getDataHandler);

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
  <Alert />
  <div v-if="selectedUser.user" class="schedule-container">
    <button @click="generatePDF(selectedUser, selectedMonth)">Get Schedule</button>
    <CalendarNavigation
        :selected-month="selectedMonth.month"
        @add="nextMonth"
        @sub="prevMonth"
    />
    <div v-if="isLoading" class="loading-spinner">
      <Spinner />
    </div>
    <ScheduleTable
        v-else
        :days-in-month="selectedMonth.daysInMonth"
    />
  </div>
  <div v-else class="no-user">
    <p>No user selected. Please choose a user to view the schedule.</p>
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
