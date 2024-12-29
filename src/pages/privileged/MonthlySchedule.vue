<script setup>
import "jspdf-autotable";
import {onMounted, ref, watch} from "vue";
import Spinner from "@/components/Spinner.vue";
import {useCalendarNavigation} from "@/composables/utils.js";
import {generatePDF} from "@/composables/pdfScheduleHandler.js";
import ScheduleTable from "@/pages/privileged/ScheduleTable.vue";
import {processMonthlyShifts} from "@/composables/monthlyShiftsAggregator.js";
import {usePrivilegedSelectedUser} from "@/stores/privilegedStore.js";
import {useSelectedMonthStore, useSelectedDayStore} from "@/stores/utilsStore.js";
import CalendarNavigation from "@/components/calendarNav/CalendarNavigation.vue";

const selectedUser = usePrivilegedSelectedUser();
const selectedMonth = useSelectedDayStore('privilegedSelectedMonth')
const monthTime = useSelectedMonthStore('privilegedMonthTime')
const isLoading = ref(false)


const getDataHandler = async () => {
  isLoading.value = true;
  const result = await processMonthlyShifts(selectedUser, selectedMonth, monthTime);
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
