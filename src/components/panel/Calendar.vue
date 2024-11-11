<script setup>
import {ref, onMounted, defineEmits, inject} from 'vue';
import { format,  add, sub, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import {deleteShiftFetch, getUserShifts} from "@/fetchers.js";
import {formatTime} from "@/utils.js";
import ShiftsModal from "@/components/modals/ShiftsModal.vue";
import CustomModal from "@/components/modals/CustomModal.vue";
import Alert from "@/components/utils/Alert.vue";
import {range} from "@/utils.js";
import CustomNaviButton from "@/components/utils/CustomNaviButton.vue";

const alert = inject('alert');

const currentMonth = ref(new Date());
const calculatedWorkTime = ref(0)
const calculatedOvertimeTime = ref(0)
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
  calculatedWorkTime.value = 0;
  calculatedOvertimeTime.value = 0;

  try {
    const shifts = await getUserShifts(format(currentMonth.value, 'yyyy-MM'));

    startDay.value = new Date(daysInMonth.value[0]['date']).getDay() || 7;
    endDay.value = new Date(daysInMonth.value[daysInMonth.value.length - 1]['date']).getDay() || 7;
    daysBeforeRange.value = range(2, startDay.value);
    daysAfterRange.value = range(endDay.value, 6);

    const getDate = (dateTimeStr) => dateTimeStr.split('T')[0];

    const splitOverTime = (shiftTime) => {
      if (shiftTime <= 28800) {
        return {'work': shiftTime, 'overtime': 0};
      } else {
        return {'work': 28800, 'overtime': shiftTime - 28800};
      }
    };

    const groupedShifts = shifts.reduce((acc, shift) => {
      const date = getDate(shift.start);
      if (!acc[date]) {
        acc[date] = {
          'list': [],
          'totalWork': 0,
        };
      }
      acc[date].list.push(shift);
      acc[date].totalWork += shift.work;

      return acc;
    }, {});

    Object.keys(groupedShifts).forEach(date => {
      const totalWork = groupedShifts[date].totalWork;
      const splitOvertime = splitOverTime(totalWork);

      calculatedWorkTime.value += splitOvertime.work;
      calculatedOvertimeTime.value += splitOvertime.overtime;

      groupedShifts[date].regular = splitOvertime.work;
      groupedShifts[date].overtime = splitOvertime.overtime;
    });

    daysInMonth.value = daysInMonth.value.map(day => {
      const formattedDate = format(day.date, 'yyyy-MM-dd');
      return {
        ...day,
        shifts: groupedShifts[formattedDate] || { list: [], regular: 0 }
      };
    });

    emit('calculatedTime',
        {'work': formatTime(calculatedWorkTime.value), 'overtime': formatTime(calculatedOvertimeTime.value)});

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
        { 'unfinished-shift': day.shifts.list.length > 0, 'finished-shift': day.shifts.regular >= 28800}]"
        @click="openModal(day)"
      >
        <span class="day-header">{{ day.date.getDate() }}</span>
        <div class="shifts-list">

          <small
              v-if="day.shifts.list.length > 0"
              class="shift"
          >{{ formatTime(day.shifts.regular) }}</small>
          <small
              v-if="day.shifts.list.length > 0 && day.shifts.overtime !== 0"
              class="shift overtime"
          >{{ formatTime(day.shifts.overtime) }}</small>

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
  width: 100px;
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
  width: 95%;
  margin-top: 10px;
}

.nav-label {
  width: 200px;
  display: block;
  text-align: center;
  margin: 5px 10px;
  font-size: 20px;
  color:var(--color-text-active)
}

.unfinished-shift {
  background: var(--vt-c-indigo);
}

.finished-shift {
  background: var(--finished-color);
}

.started-shift {
  color: var(--idle-color);
}

.shift {
  font-size: 15px;
  color:var(--color-text-active)
}

.overtime {
  color: var(--color-text-overtime);
}

.preview-month-day {
  background: var(--vt-c-black-mute);
  border-radius: 8px;
}

@media(max-width: 875px) {
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
  .calendar-day,
  .preview-month-day {
    width: 90px;
    height: 90px;
  }
}

@media(max-width: 800px) {
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
  }
  .calendar-day,
  .preview-month-day {
    width: 80px;
    height: 80px;
    border-radius: 5px;
  }
}

@media(max-width: 750px) {
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
    gap: 10px;
  }

  .calendar-day,
  .preview-month-day {
    width: 75px;
    height: 75px;
    border-radius: 5px;
    padding: 4px;
  }
}

@media(max-width: 690px) {
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 10px;
  }

  .calendar-day,
  .preview-month-day {
    width: 70px;
    height: 70px;
    border-radius: 5px;
    padding: 4px;
  }

  .shift {
    font-size: 13px;
  }
}

@media(max-width: 650px) {
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
    gap: 8px;
  }

  .calendar-day,
  .preview-month-day {
    width: 65px;
    height: 65px;
    border-radius: 3px;
    padding: 4px;
  }

  .shift,
  .day-header {
    font-size: 11px;
  }

}

@media(max-width: 620px) {
  .calendar {
    padding: 10px;
  }

  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 8px;
  }

  .calendar-day,
  .preview-month-day {
    width: 60px;
    height: 60px;
    border-radius: 3px;
    padding: 3px;
  }

  .shift,
  .day-header,
  .calendar-grid small {
    font-size: 11px;
  }

}

@media(max-width: 570px) {
  .calendar {
    padding: 10px;
  }

  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(55px, 1fr));
    gap: 8px;
  }

  .calendar-day,
  .preview-month-day {
    width: 55px;
    height: 55px;
    border-radius: 3px;
    padding: 3px;
  }

  .shift,
  .day-header,
  .calendar-grid small {
    font-size: 9px;
  }
}

@media(max-width: 520px) {
  .calendar {
    padding: 10px;
  }

  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 8px;
  }

  .calendar-day,
  .preview-month-day {
    width: 50px;
    height: 50px;
    border-radius: 3px;
    padding: 2px;
  }

  .shift,
  .day-header,
  .calendar-grid small {
    font-size: 7px;
  }
}

@media(max-width: 480px) {
  .calendar {
    padding: 10px;
  }

  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
    gap: 6px;
  }

  .calendar-day,
  .preview-month-day {
    width: 45px;
    height: 45px;
    border-radius: 2px;
    padding: 2px;
  }

  .shift,
  .day-header,
  .calendar-grid small {
    font-size: 8px;
  }
}

@media(max-width: 430px) {
  .calendar {
    padding: 10px;
  }

  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 5px;
  }

  .calendar-day,
  .preview-month-day {
    width: 40px;
    height: 40px;
    border-radius: 2px;
    padding: 2px;
  }

  .shift,
  .day-header,
  .calendar-grid small {
    font-size: 7px;
  }
}

@media(max-height: 1000px) {
  .calendar {
    padding: 0;
  }
}

</style>
