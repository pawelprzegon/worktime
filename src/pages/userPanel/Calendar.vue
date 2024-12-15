<script setup>
import '@/assets/calendarNavigation.css';
import {ref, onMounted, inject} from 'vue';
import Alert from "@/components/Alert.vue";
import Spinner from "@/components/Spinner.vue";
import {useAuthStore} from "@/stores/authStore.js";
import ShiftsModal from "@/pages/userPanel/ShiftsModal.vue";
import {getData, removeShift} from "@/composables/calendarHandler.js";
import CalendarNavigation from "@/components/calendarNav/CalendarNavigation.vue";
import {useCalendarMonthTime, useCalendarSelectedMonth} from "@/stores/calendarStore.js";
import {formatTime, useCalendarDays, useModal, daysOfWeek, useCalendarNavigation} from "@/utils.js";


const authStore = useAuthStore()
const selectedMonth = useCalendarSelectedMonth();
const monthTime = useCalendarMonthTime();

const alert = inject('alert');
const isLoading = ref(true);

const getDataHandler = () => {
  isLoading.value = true;
  const result = getData(authStore, selectedMonth, monthTime);
  isLoading.value = !result;
}

const { prevMonth, nextMonth } = useCalendarNavigation(selectedMonth, getDataHandler);
const { isModalOpen, selectedDay, modalKey, openModal, closeModal, refreshModal } = useModal(selectedMonth);
const { getDaysBefore, getDaysAfter } = useCalendarDays(selectedMonth);

const handleRemoveShift = async (shiftId) => {
  await removeShift(shiftId, selectedDay, alert);
  getDataHandler()
};

onMounted(async () => {
  selectedMonth.updateDaysInMonth();
  getDataHandler();

});

</script>

<template>
  <Alert />

  <div class="calendar">
    <CalendarNavigation
        :selected-month="selectedMonth.month"
        @add="nextMonth"
        @sub="prevMonth"
    />
     <div v-if="isLoading" class="loading-spinner">
      <Spinner />
    </div>
    <div v-else class="calendar-grid">
      <small
          v-for="(day, index) in daysOfWeek"
          :key="index"
          style="text-align: center;"
      >
        {{day}}
      </small>

      <div v-for="(index) in getDaysBefore()" :key="index" class="preview-month-day"></div>
      <div
        v-for="(day, index) in selectedMonth.daysInMonth"
        :key="index"
        :class="['calendar-day',
        {
          'unfinished-shift': day.shifts.list.length > 0,
          'finished-shift': (day.shifts.regular + (day.shifts.overtimeTaken?.hours || 0) * 3600) >= 28800
        }]"
        @click="openModal(day)"
      >
        <span class="day-header">{{ day.date.getDate() }}</span>
        <div class="shifts-list">

          <small
              v-if="day.shifts.list.length > 0"
              class="shift"
              :class="{'has-corrections': day.shifts.overtimeTaken}"
          >
            {{ formatTime(day.shifts.regular) }}
          </small>

          <small
              v-if="day.shifts.list.length > 0 && day.shifts.overtime"
              class="shift overtime"
          >
            +{{ formatTime(day.shifts.overtime) }}
          </small>

          <small
              v-if="day.shifts.overtimeTaken"
              class="shift overtime"
          >
            -{{ formatTime(day.shifts.overtimeTaken.hours * 3600) }}
          </small>

        </div>
      </div>
      <div v-for="(index) in getDaysAfter()" :key="index" class="preview-month-day"></div>
    </div>

    <ShiftsModal
        v-if="isModalOpen && selectedDay?.shifts.list.length > 0"
        :key="modalKey"
        :shifts="selectedDay?.shifts.list"
        :overtime="selectedDay?.shifts.overtimeTaken"
        :calculatedOvertime="selectedMonth.calculatedOvertimeTime"
        :selectedDay="selectedDay.date"
        @closeModal="closeModal"
        @removeShift="handleRemoveShift"
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

.preview-month-day {
  background: var(--vt-c-black-mute);
  border-radius: 8px;
  width: 100px;
  height: 100px;
}


.shifts-list {
  display: flex;
  flex-direction: column;
  justify-content: right;
  align-items: flex-end;
}

.has-corrections {
  position: relative;
}

.has-corrections::after {
  content: '';
  position: absolute;
  top: 1px;
  right: -3px;
  width: 6px;
  height: 6px;
  background-color: var(--color-text-overtime);
  border-radius: 50%;
}

input[type="number"] {
  width: 60px;
}

textarea {
  width: 95%;
  margin-top: 10px;
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


@media(max-width: 875px) {
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
  .calendar-day,
  .preview-month-day {
    width: 90px;
    height: 90px;
  }
  .has-corrections::after {
    width: 5px;
    height: 5px;
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

  .has-corrections::after {
    width: 4px;
    height: 4px;
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

  .overtime {
    font-size: 6px;
  }
}

@media(max-height: 1000px) {
  .calendar {
    padding: 0;
  }
}

</style>
