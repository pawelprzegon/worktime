<script setup>

import {getUserShifts} from "@/fetchers.js";
import {ref, onMounted} from "vue";
import DateDetail from "@/components/panel/DateDetail.vue";

const dates = ref([])

onMounted(async () => {
  try {
    const shifts = await getUserShifts()

    const getDate = (dateTimeStr) => dateTimeStr.split(' ')[0];

    const groupedShifts = shifts.reduce((acc, shift) => {
      const date = getDate(shift.start);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(shift);
      return acc;
    }, {});

    const shiftsByDate = Object.keys(groupedShifts).map(date => ({
      date: date,
      shifts: groupedShifts[date]
    }));

    shiftsByDate.sort((a, b) => new Date(a.data) - new Date(b.data));
    console.log(shiftsByDate)
    dates.value = shiftsByDate

  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

</script>

<template>

  <div class="shifts">
   <DateDetail
       v-for="date in dates"
       :date="date"
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