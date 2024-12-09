<script setup>

import {add, eachDayOfInterval, endOfMonth, format, startOfMonth, sub} from "date-fns";
import CustomNaviButton from "@/components/CustomNaviButton.vue";
import {daysInMonth, getData} from "@/composables/privilegedHandler.js";
import {useSelectedMonth, useSelectedUser} from "@/stores/privilegedStore.js";
import '@/assets/calendarNavigation.css';

const selectedUser = useSelectedUser()
const selectedMonth = useSelectedMonth();

const updateDaysInMonth = () => {
  daysInMonth.value = eachDayOfInterval({
    start: startOfMonth(selectedMonth.month),
    end: endOfMonth(selectedMonth.month),
  }).map(date => ({
    date,
    hours: 0,
    note: '',
    shifts: { list: [], summary: 0 }
  }));
};

const prevMonth = () => {
  selectedMonth.month = sub(selectedMonth.month, { months: 1 });
  updateDaysInMonth();
  getData(selectedUser, selectedMonth);
};

const nextMonth = () => {
  selectedMonth.month = add(selectedMonth.month, { months: 1 });
  updateDaysInMonth();
  getData(selectedUser, selectedMonth);
};

</script>

<template>
  <div class="calendar-navigation">
    <CustomNaviButton direction="preview" size="20" @click="prevMonth"/>
    <span class="nav-label">{{ format(selectedMonth.month, 'MMMM yyyy') }}</span>
    <CustomNaviButton direction="next" size="20" @click="nextMonth"/>
  </div>
</template>

<style scoped>

</style>