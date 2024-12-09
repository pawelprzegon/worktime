<script setup>
import "jspdf-autotable";
import {onMounted, ref, watch} from "vue";
import {add, eachDayOfInterval, endOfMonth, format, startOfMonth, sub} from "date-fns";
import CustomNaviButton from "@/components/CustomNaviButton.vue";
import {useSelectedUser, useSelectedMonth} from "@/stores/privilegedStore.js";
import {generatePDF} from "@/composables/pdfScheduleHandler.js";
import {
  calculateTime,
  daysInMonth,
  getDates
} from "@/composables/privilegedHandler.js";


const selectedUser = useSelectedUser();
const selectedMonth = useSelectedMonth();


const getData = () => {
  getDates(selectedUser.user._id, selectedMonth.month)
}

watch(
  () => selectedUser.user, () => {
    getData();
  },
  { deep: true }
);

onMounted(() => {
  if (selectedUser.user) {
    getData();
  }
});

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
  getData()
};

const nextMonth = () => {
  selectedMonth.month = add(selectedMonth.month, { months: 1 });
  updateDaysInMonth();
  getData()
};


</script>

<template>
  <div v-if="selectedUser.user">
    <button @click="generatePDF(selectedUser, selectedMonth)">Get Schedule</button>

    <div class="calendar-navigation">
      <CustomNaviButton direction="preview" size="20" @click="prevMonth"/>
      <span class="nav-label">{{ format(selectedMonth.month, 'MMMM yyyy') }}</span>
      <CustomNaviButton direction="next" size="20" @click="nextMonth"/>
    </div>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Start time</th>
          <th>Stop time</th>
          <th>Regular Work time</th>
          <th>Over time</th>
          <th>Overtime taken</th>
        </tr>
      </thead>
      <tbody>
        <tr
            v-for="(day, index) in daysInMonth"
            :key="index"
            v-html="calculateTime(day)"
        >
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

/* Styl całej tabeli */
table {
  width: 800px;
  border-collapse: collapse; /* Usuwa przerwy między ramkami */
  margin-top: 20px;
}

/* Nagłówki tabeli */
thead th {
  background-color: var(--color-background-mute); /* Jaśniejszy kolor nagłówka */
  color: var(--color-text-active); /* Kolor tekstu nagłówka */
  border: 1px solid var(--color-background-light); /* Ramki wokół nagłówków */
  padding: 10px;
  text-align: center;
}

/* Ramki dla komórek tabeli */
td, th {
  border: 1px solid var(--color-background-light); /* Jasnoszare ramki */
  padding: 10px; /* Dodaje odstęp wewnętrzny */
  text-align: center; /* Wyrównanie tekstu */
}

/* Naprzemienne kolory wierszy */
tbody tr:nth-child(odd) {
  background-color: #3f3f3f; /* Jasnoszary */
}

tbody tr:nth-child(even) {
  background-color: #333333; /* Ciemniejszy szary */
}

tr {
  text-align: center;
}

::v-deep(.achieved) {
  color: #6f986f;
}

::v-deep(.not-achieved) {
  color: #9a4242;
}


</style>
