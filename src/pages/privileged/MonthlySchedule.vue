<script setup>
import "jspdf-autotable";
import {onMounted, watch} from "vue";
import {usePrivilegedSelectedUser, usePrivilegedSelectedMonth} from "@/stores/privilegedStore.js";
import {generatePDF} from "@/composables/pdfScheduleHandler.js";
import {getData} from "@/composables/privilegedHandler.js";
import ScheduleTable from "@/pages/privileged/ScheduleTable.vue";
import CalendarNavigation from "@/components/calendarNav/CalendarNavigation.vue";
import {add, sub} from "date-fns";


const selectedUser = usePrivilegedSelectedUser();
const selectedMonth = usePrivilegedSelectedMonth();

const prevMonth = () => {
  selectedMonth.month = sub(selectedMonth.month, { months: 1 });
  selectedMonth.updateDaysInMonth();
    getData(selectedUser, selectedMonth);
};

const nextMonth = () => {
  selectedMonth.month = add(selectedMonth.month, { months: 1 });
  selectedMonth.updateDaysInMonth();
    getData(selectedUser, selectedMonth);
};

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
    <CalendarNavigation
        :selected-month="selectedMonth.month"
        @add="nextMonth"
        @sub="prevMonth"
    />
    <ScheduleTable
        :days-in-month="selectedMonth.daysInMonth"
    />
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
