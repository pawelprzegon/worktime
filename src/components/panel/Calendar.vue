<script setup>
import { ref, onMounted, defineProps} from 'vue';
import { format,  add, sub, eachDayOfInterval, startOfMonth, endOfMonth, getMonth } from 'date-fns';
import {getUserShifts} from "@/fetchers.js";


const currentMonth = ref(new Date());
const dates = ref([])

const daysInMonth = ref(
  eachDayOfInterval({
    start: startOfMonth(currentMonth.value),
    end: endOfMonth(currentMonth.value),
  }).map(date => ({
    date,
    hours: 0,
    note: ''
  }))
);

const updateDaysInMonth = () => {
  daysInMonth.value = eachDayOfInterval({
    start: startOfMonth(currentMonth.value),
    end: endOfMonth(currentMonth.value),
  }).map(date => ({
    date,
    hours: 0,
    note: ''
  }));
};


const prevMonth = () => {
  currentMonth.value = sub(currentMonth.value, { months: 1 });
  updateDaysInMonth();
  getDates()
};

const nextMonth = () => {
  currentMonth.value = add(currentMonth.value, { months: 1 });
  updateDaysInMonth();
  getDates()
};

const getDates = async () => {
  try {
    const shifts = await getUserShifts(format(currentMonth.value, 'YYYY-MM'))

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

    dates.value = shiftsByDate

  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

onMounted(() => {
  updateDaysInMonth();
  getDates()
})

</script>

<template>
  <div class="calendar-navigation">
    <button @click="prevMonth">Preview month</button>
    <span>{{ format(currentMonth, 'MMMM yyyy') }}</span>
    <button @click="nextMonth">Next month</button>
  </div>

  <div class="calendar">

    <div class="calendar-grid">
      <div
        v-for="(day, index) in daysInMonth"
        :key="index"
        class="calendar-day"
      >
        <div class="day-header">
          <span>{{ day.date.getDate() }}</span>
          <input
            type="number"
            v-model="day.hours"
            placeholder="Godziny"
            min="0"
            max="24"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.calendar-day {
  background-color: var(--vt-c-black-mute);
  border: 1px solid var(--vt-c-black-mute);
  padding: 10px;
  border-radius: 8px;
  width: 100px;
  height: 100px;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

input[type="number"] {
  width: 60px;
}

textarea {
  width: 100%;
  margin-top: 10px;
}
</style>
