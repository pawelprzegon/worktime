<script setup>
import {ref, onMounted, defineEmits, onBeforeUnmount} from 'vue';
import { format,  add, sub, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import {getUserShifts} from "@/fetchers.js";
import CustomButton from "@/components/utils/CustomButton.vue";
import ShiftDetailsTooltip from "@/components/panel/shift/ShiftDetailsTooltip.vue";
import {formatTime} from "@/utils.js";


const currentMonth = ref(new Date());
const calculatedTime = ref(0)
const emit = defineEmits(['calculatedTime'])

const daysInMonth = ref(
  eachDayOfInterval({
    start: startOfMonth(currentMonth.value),
    end: endOfMonth(currentMonth.value),
  }).map(date => ({
    date,
    hours: 0,
    note: '',
    shifts: { list: [], summary: 0 }
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
    shifts: { list: [], summary: 0 }
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
    const shifts = await getUserShifts(format(currentMonth.value, 'yyyy-MM'));

    const getDate = (dateTimeStr) => dateTimeStr.split('T')[0];

    const groupedShifts = shifts.reduce((acc, shift) => {
      calculatedTime.value += shift.work;
      const date = getDate(shift.start);
      if (!acc[date]) {
        acc[date] = {
          'list': [],
          'summary': 0
        };
      }
      acc[date].list.push(shift);
      acc[date].summary += shift.work
      return acc;
    }, {});

    daysInMonth.value = daysInMonth.value.map(day => {
      const formattedDate = format(day.date, 'yyyy-MM-dd');
      return {
        ...day,
        shifts: groupedShifts[formattedDate] || { list: [], summary: 0 }
      };
    });
    console.log(formatTime(calculatedTime.value))
    emit('calculatedTime', formatTime(calculatedTime.value));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};



const calculateCurrentShiftTime = (shiftStart) => {
  const now = new Date();
  const shiftStartDate = new Date(shiftStart);
  const diffSeconds = Math.floor((now - shiftStartDate) / 1000);
  return formatTime(diffSeconds);
};

const updateCurrentShiftTime = () => {
  daysInMonth.value.forEach(day => {
    day.shifts.list.forEach(shift => {
      if (!shift.stop) {
        shift.currentShiftTime = calculateCurrentShiftTime(shift.start);
      }
    });
  });
};

onMounted(() => {
  getDates()
  updateDaysInMonth();

  const interval = setInterval(() => {
    updateCurrentShiftTime();
  }, 1000);

  onBeforeUnmount(() => clearInterval(interval));

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
        :class="['calendar-day', { 'finished-shift': day.shifts.list.length > 0}]"
      >

        <span class="day-header">{{ day.date.getDate() }}</span>

        <div class="shifts-list">

          <div
              v-if="day.shifts.list"
          >
            <small class="shift">
              {{ formatTime(day.shifts.summary) }}
            </small>

          </div>

        </div>

        <ShiftDetailsTooltip
          :shifts="day.shifts.list"
          :formatTime="formatTime"
        />

      </div>

    </div>
  </div>
</template>

<style scoped>

.calendar {
  display: block;
  padding: 20px;
  max-width: 800px;
}

.calendar-navigation {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.calendar-day {
  background-color: var(--vt-c-black-mute);
  border: 1px solid var(--vt-c-black-mute);
  padding: 6px;
  border-radius: 8px;
  min-width: 100px;
  width: 100%;
  height: 100px;
}

.day-header {
  display: block;
  border-bottom: 1px solid #595959;

}

.shifts-list {
  display: flex;
  flex-direction: column;
  justify-content: right;
  align-items: flex-end;
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

.finished-shift {
  background: #002f00;
}

.started-shift {
  color: #bd7d00;
}

.shift {
  font-size: 15px;
}

</style>
