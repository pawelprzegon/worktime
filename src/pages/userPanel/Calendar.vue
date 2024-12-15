<script setup>
import '@/assets/calendarNavigation.css';
import {ref, onMounted, inject, watch} from 'vue';
import Alert from "@/components/Alert.vue";
import Spinner from "@/components/Spinner.vue";
import {useAuthStore} from "@/stores/authStore.js";
import ShiftsModal from "@/pages/userPanel/ShiftsModal.vue";
import {removeShift} from "@/composables/calendarHandler.js";
import {processMonthlyShifts } from "@/composables/monthlyShiftsAggregator.js";
import {useCalendarStore, useCalendarMonthTime} from "@/stores/utilsStore.js";
import CalendarNavigation from "@/components/calendarNav/CalendarNavigation.vue";
import {formatTime, useCalendarDays, daysOfWeek, useCalendarNavigation} from "@/composables/utils.js";
import ShiftAdder from "@/pages/userPanel/ShiftAdderModal.vue";
import {useCalendarSelectedDay} from "@/stores/calendarStore.js";
import {format} from "date-fns";
import DayContainer from "@/pages/userPanel/DayContainer.vue";
import EmptyDayContainer from "@/pages/userPanel/EmptyDayContainer.vue";
import WeekDayNameContainer from "@/pages/userPanel/WeekDayNameContainer.vue";


const authStore = useAuthStore()
const selectedMonth = useCalendarStore('calendarSelectedMonth');
const monthTime = useCalendarMonthTime('calendarMonthTime');
const selectedDay = useCalendarSelectedDay();

const alert = inject('alert');
const isLoading = ref(true);
const isShiftAdderOpen = ref(false);
const isDailyShiftsOpen = ref(false);
const modalKey = ref(0)

const getDataHandler = () => {
  isLoading.value = true;
  const result = processMonthlyShifts(authStore, selectedMonth, monthTime);
  isLoading.value = !result;
  return result;
}

const { prevMonth, nextMonth } = useCalendarNavigation(selectedMonth, getDataHandler);

const { getDaysBefore, getDaysAfter } = useCalendarDays(selectedMonth);

const handleRemoveShift = async (shiftId) => {
  await removeShift(shiftId, selectedDay.day, alert);
  await getDataHandler()
};

const handleRefreshModal = async () => {

    await getDataHandler().then(() => {

      const dayToSet =  selectedMonth.daysInMonth.find(day =>
        format(day.date, 'yyyy-MM-dd') === format(selectedDay.day.date, 'yyyy-MM-dd')
      );
      selectedDay.setDay(dayToSet)
      modalKey.value++;
    }).catch(error => {
      console.error('getDataHandler error:', error);
    });
  };

const dayOpenerHandler = (day) => {
  selectedDay.setDay(day)
  if (day?.shifts.list.length > 0) {
    isDailyShiftsOpen.value = true
  } else {
    isShiftAdderOpen.value = true;
  }
}

const closeDailyShifts = () => {
  isDailyShiftsOpen.value = false;
}

const closeShiftAdder = () => {
  isShiftAdderOpen.value = false;
}

onMounted(async () => {
  selectedMonth.updateDaysInMonth();
  await getDataHandler();

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
      <WeekDayNameContainer
        v-for="(day, index) in daysOfWeek"
        :key="index"
        :day="day"
      />

      <EmptyDayContainer
          v-for="(index) in getDaysBefore()"
          :key="index"
      />

      <DayContainer
        v-for="(day, index) in selectedMonth.daysInMonth"
        :key="index"
        :day="day"
        @click="dayOpenerHandler(day)"
      />
      <EmptyDayContainer
          v-for="(index) in getDaysAfter()"
          :key="index"
      />
    </div>

    <ShiftAdder
        v-if="isShiftAdderOpen"
        :closeModal="closeShiftAdder"
    />
    <ShiftsModal
        v-if="isDailyShiftsOpen && selectedDay.day?.shifts.list.length > 0"
        :key="modalKey"
        :shifts="selectedDay.day?.shifts.list"
        :overtime="selectedDay.day?.shifts.overtimeTaken"
        :calculatedOvertime="selectedMonth.calculatedOvertimeTime"
        :selectedDay="selectedDay.day?.date"
        :closeModal="closeDailyShifts"
        @remove-shift="handleRemoveShift"
        @refresh-modal="handleRefreshModal"
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



input[type="number"] {
  width: 60px;
}

textarea {
  width: 95%;
  margin-top: 10px;
}

@media(max-width: 875px) {
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}

@media(max-width: 800px) {
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
  }
}

@media(max-width: 750px) {
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
    gap: 10px;
  }
}

@media(max-width: 690px) {
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 10px;
  }
}

@media(max-width: 650px) {
  .calendar-grid {
    grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
    gap: 8px;
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
