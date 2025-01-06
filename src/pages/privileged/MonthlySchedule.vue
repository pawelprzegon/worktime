<script setup>
import "jspdf-autotable";
import {onMounted, ref, watch} from "vue";
import Spinner from "@/components/Spinner.vue";
import {useCalendarNavigation} from "@/composables/utils.js";
import {generatePDF} from "@/composables/pdfScheduleHandler.js";
import ScheduleTable from "@/pages/privileged/ScheduleTable.vue";
import {usePrivilegedSelectedUser} from "@/stores/privilegedStore.js";
import {useScreenSizeStore, useSelectedMonthStore} from "@/stores/utilsStore.js";
import CalendarNavigation from "@/components/calendarNav/CalendarNavigation.vue";

const selectedUser = usePrivilegedSelectedUser();
const screenSize = useScreenSizeStore()
const monthStore = useSelectedMonthStore('privileged')
const isLoading = ref(false)


const getDataHandler = async () => {
  isLoading.value = true;
  const result = await monthStore.processMonthlyShifts()
  isLoading.value = !result;
};

const { prevMonth, nextMonth } = useCalendarNavigation(monthStore, getDataHandler);

watch(
  () => selectedUser.user,  async() => {
     await getDataHandler();
  },
  { deep: true }
);

onMounted( async() => {
  if (monthStore.selected.month && selectedUser.user) {
    await getDataHandler();
  }
  screenSize.setSize(window.innerWidth);
  window.addEventListener('resize', screenSize.setSize(window.innerWidth));
});

</script>

<template>
  <div v-if="selectedUser.user" class="schedule-container">
    <button @click="generatePDF(selectedUser, monthStore)">Get Schedule</button>
    <CalendarNavigation
        :selected-month="monthStore.selected.month"
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
