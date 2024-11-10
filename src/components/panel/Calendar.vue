<script setup>
import {ref, onMounted, defineEmits, inject} from 'vue';
import { format,  add, sub, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import {deleteShiftFetch, getUserShifts} from "@/fetchers.js";
import {formatTime} from "@/utils.js";
import ShiftsModal from "@/components/modals/ShiftsModal.vue";
import CustomModal from "@/components/CustomModal.vue";
import Alert from "@/components/Alert.vue";
import {range} from "@/utils.js";
import CustomNaviButton from "@/components/utils/CustomNaviButton.vue";

const alert = inject('alert');

const currentMonth = ref(new Date());
const calculatedTime = ref(0)
const isModalOpen = ref(false);
const selectedDay = ref(null);
const modalKey = ref(0);
const startDay = ref(null);
const daysBeforeRange = ref(null);
const endDay = ref(null);
const daysAfterRange = ref(null);

const openModal = (day) => {
  selectedDay.value = day;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
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

const refreshShifts = () => {
  updateDaysInMonth();
  getDates()
}

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
  calculatedTime.value = 0
  try {
    const shifts = await getUserShifts(format(currentMonth.value, 'yyyy-MM'));
    console.log(new Date(daysInMonth.value[0]['date']).getDay() || 7)
    startDay.value = new Date(daysInMonth.value[0]['date']).getDay() || 7;
    endDay.value = new Date(daysInMonth.value[daysInMonth.value.length - 1]['date']).getDay() || 7;
    daysBeforeRange.value = range(2, startDay.value)
    daysAfterRange.value = range(endDay.value, 7)

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

    emit('calculatedTime', formatTime(calculatedTime.value));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const removeShift = async(shiftId) => {
  selectedDay.value.shifts.list = selectedDay.value.shifts.list.filter(shift => shift.id !== shiftId);
  const response = await deleteShiftFetch(shiftId)
  refreshShifts()
  alert.show(response.status, response.message)
}

const refreshModal = () => {
  updateDaysInMonth();
  getDates()
  modalKey.value += 1;
};

onMounted(() => {
  updateDaysInMonth();
  getDates()
})

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

</script>

<template>
  <Alert />
  <div class="calendar">

    <div class="calendar-navigation">
      <CustomNaviButton direction="preview" size="20" @click="prevMonth"/>
      <span class="nav-label">{{ format(currentMonth, 'MMMM yyyy') }}</span>
      <CustomNaviButton direction="next" size="20" @click="nextMonth"/>
    </div>

    <div class="calendar-grid">
      <small
          v-for="(day, index) in daysOfWeek"
          :key="index"
          style="text-align: center;"
      >
        {{day}}
      </small>
      <div v-for="(index) in daysBeforeRange" :key="index" class="preview-month-day"></div>
      <div
        v-for="(day, index) in daysInMonth"
        :key="index"
        :class="['calendar-day',
        { 'unfinished-shift': day.shifts.list.length > 0, 'finished-shift': day.shifts.summary >= 28800}]"
        @click="openModal(day)"
      >
        <span class="day-header">{{ day.date.getDate() }}</span>
        <div class="shifts-list">
          <div v-if="day.shifts.list.length > 0">
            <small class="shift">
              {{ formatTime(day.shifts.summary) }}
            </small>
          </div>
        </div>
      </div>
      <div v-for="(index) in daysAfterRange" :key="index" class="preview-month-day"></div>
    </div>

    <CustomModal
        v-if="isModalOpen && selectedDay?.shifts.list.length > 0"
        :key="modalKey"
        :modalComponent="ShiftsModal"
        :modalProps="selectedDay?.shifts.list"
        @closeModal="closeModal"
        @toggleShift="refreshShifts"
        @removeShift="removeShift"
        @refreshModal="refreshModal"
    />

  </div>
</template>

<style scoped>

.calendar {
  grid-area: calendar;
  padding: 20px;
  width:100%;
}

.calendar-navigation {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  max-width: 800px;
  margin: 0 auto
}

.calendar-day {
  background-color: var(--vt-c-black-mute);
  border: 1px solid var(--vt-c-black-mute);
  padding: 6px;
  border-radius: 8px;
  min-width: 100px;
  width: 100%;
  height: 100px;
  transition: transform 0.2s ease;
  box-shadow: var(--vt-box-shadow)
}

.calendar-day:hover {
  cursor: pointer;
  transform: scale(1.02);
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
  width: 200px;
  display: block;
  text-align: center;
  margin: 5px 10px;
  font-size: 20px;
}

.unfinished-shift {
  background: #2c3e50;
}

.finished-shift {
  background: #2c5032;
}

.started-shift {
  color: #bd7d00;
}

.shift {
  font-size: 15px;
}

.preview-month-day {
  background: #1c1c1c;
  border-radius: 8px;
}

</style>
