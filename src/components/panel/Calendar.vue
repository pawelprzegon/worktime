<script setup>
import { ref, onMounted } from 'vue';
import { format,  add, sub, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import {getUserShifts} from "@/fetchers.js";
import CustomButton from "@/components/utils/CustomButton.vue";
import ShiftDetailsTooltip from "@/components/panel/ShiftDetailsTooltip.vue";


const currentMonth = ref(new Date());
const dates = ref([])

const daysInMonth = ref(
  eachDayOfInterval({
    start: startOfMonth(currentMonth.value),
    end: endOfMonth(currentMonth.value),
  }).map(date => ({
    date,
    hours: 0,
    note: '',
    shifts: []
  }))
);

const updateDaysInMonth = () => {
  daysInMonth.value = eachDayOfInterval({
    start: startOfMonth(currentMonth.value),
    end: endOfMonth(currentMonth.value),
  }).map(date => ({
    date,
    hours: 0,
    note: '',
    shifts: []
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
    const shifts = await getUserShifts(format(currentMonth.value, 'yyyy-MM'))

    const getDate = (dateTimeStr) => dateTimeStr.split(' ')[0];

    const groupedShifts = shifts.reduce((acc, shift) => {
      const date = getDate(shift.start);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(shift);
      return acc;
    }, {});

    // const shiftsByDate = Object.keys(groupedShifts).map(date => ({
    //   date: date,
    //   shifts: groupedShifts[date]
    // }));
    //
    // shiftsByDate.sort((a, b) => new Date(a.data) - new Date(b.data));
    //
    // dates.value = shiftsByDate

    daysInMonth.value = daysInMonth.value.map(day => {
      const formattedDate = format(day.date, 'yyyy-MM-dd');
      return {
        ...day,
        shifts: groupedShifts[formattedDate] || []
      };
    });


  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(0);

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}

onMounted(() => {
  getDates()
  updateDaysInMonth();
})

</script>

<template>
  <div class="calendar">

    <div class="calendar-navigation">
      <CustomButton
          label="preview"
          :margin="10"
          :padding="1"
          :width="100"
          @click="prevMonth"

      ></CustomButton>

      <span class="nav-label">{{ format(currentMonth, 'MMMM yyyy') }}</span>

      <CustomButton
          label="next"
          :margin="10"
          :padding="1"
          :width="100"
          @click="nextMonth"
      ></CustomButton>
    </div>

    <div class="calendar-grid">
      <div
        v-for="(day, index) in daysInMonth"
        :key="index"
        :class="['calendar-day', { 'present-shift': day.shifts.length > 0 }]"
      >
        <div class="day-header">
          <span>{{ day.date.getDate() }}</span>

          <small
              class="shift"
              v-if="day.shifts.length > 0"
              v-for="shift in day.shifts"
          >
            {{ formatTime(shift.work) }}

            <ShiftDetailsTooltip
              :shift="shift"
            />

          </small>


        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.calendar {
  display: block;
  padding: 20px;
}

.calendar-navigation {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.calendar-day {
  background-color: var(--vt-c-black-mute);
  border: 1px solid var(--vt-c-black-mute);
  padding: 6px;
  border-radius: 8px;
  width: 100px;
  height: 100px;
}

.day-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

}

input[type="number"] {
  width: 60px;
}

textarea {
  width: 100%;
  margin-top: 10px;
}

.nav-label {
  width: 120px;
  display: block;
  text-align: center;
}

.present-shift {
  background: #002f00;
}


</style>
