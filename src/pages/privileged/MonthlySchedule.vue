<script setup>
import "jspdf-autotable";
import {onMounted, ref, watch} from "vue";
import Alert from "@/components/Alert.vue";
import {useCalendarMonthTime, useCalendarStore} from "@/utils.js";
import Spinner from "@/components/Spinner.vue";
import {useCalendarNavigation, getData} from "@/utils.js";
import {generatePDF} from "@/composables/pdfScheduleHandler.js";
import ScheduleTable from "@/pages/privileged/ScheduleTable.vue";
import CalendarNavigation from "@/components/calendarNav/CalendarNavigation.vue";
import {usePrivilegedSelectedUser} from "@/stores/privilegedStore.js";


const selectedUser = usePrivilegedSelectedUser();
const selectedMonth = useCalendarStore('privilegedSelectedMonth')
const monthTime = useCalendarMonthTime('privilegedMonthTime')
const isLoading = ref(false)


const getDataHandler = async () => {
  isLoading.value = true;
  const result = await getData(selectedUser, selectedMonth, monthTime);
  isLoading.value = !result;
};

const { prevMonth, nextMonth } = useCalendarNavigation(selectedMonth, getDataHandler);

watch(
  () => selectedUser.user,  () => {
      getDataHandler();
  },
  { deep: true }
);

onMounted( () => {
  if (selectedMonth.month && selectedUser.user) {
    getDataHandler();
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
