<script setup>
import '@/assets/calendarNavigation.css';
import {ref, onMounted, watch} from 'vue';
import Spinner from "@/components/Spinner.vue";
import ShiftsDetailsModal from "@/pages/userPanel/modals/ShiftDetails/ShiftsDetailsModal.vue";
import {useScreenSizeStore, useSelectedMonthStore} from "@/stores/utilsStore.js";
import CalendarNavigation from "@/components/calendarNav/CalendarNavigation.vue";
import {useCalendarDays, daysOfWeek, useCalendarNavigation, updateScreenSize} from "@/composables/utils.js";
import ShiftAdderModal from "@/pages/userPanel/modals/ShiftAdderModal.vue";
import {useDailyShiftsList} from "@/stores/calendarStore.js";
import DayContainer from "@/pages/userPanel/calendar/DayContainer.vue";
import EmptyDayContainer from "@/pages/userPanel/calendar/EmptyDayContainer.vue";
import WeekDayNameContainer from "@/pages/userPanel/calendar/WeekDayNameContainer.vue";

const monthStore = useSelectedMonthStore('calendar');
const dailyShifts = useDailyShiftsList();
const screenSize = useScreenSizeStore()

const isLoading = ref(true);
const isShiftAdderOpen = ref(false);
const isDailyShiftsOpen = ref(false);
const modalKey = ref(0)

const getDataHandler = async () => {
  isLoading.value = true;
  const result = await monthStore.processMonthlyShifts()
  isLoading.value = !result;
  return result;
}

const { prevMonth, nextMonth } = useCalendarNavigation(monthStore, getDataHandler);

const { getDaysBefore, getDaysAfter } = useCalendarDays(monthStore);

const dayOpenerHandler = (day) => {

  dailyShifts.setDay(day);

  if (day?.list.length > 0) {
    isDailyShiftsOpen.value = true
  } else {
    if (!monthStore.selected.closed){
      isShiftAdderOpen.value = true;
    }
  }
}

const closeDailyShifts = () => {
  isDailyShiftsOpen.value = false;
}

const closeShiftAdder = () => {
  isShiftAdderOpen.value = false;
}

onMounted(async () => {
  console.log('test')
  await getDataHandler();
  updateScreenSize(screenSize);
  window.addEventListener('resize', updateScreenSize);
});

</script>

<template>


    <CalendarNavigation
        :selected-month="monthStore.selected.month"
        @add="nextMonth"
        @sub="prevMonth"
    />
     <div v-if="isLoading" class="loading-spinner">
      <Spinner />
    </div>
    <div v-else
          class="
           grid [grid-template-columns:repeat(7,minmax(90px,90px))] max-w-[800px] gap-2 mx-auto justify-items-center items-center

           below-portrait-2xs:gap-1 below-portrait-2xs:[grid-template-columns:repeat(1,minmax(200px,1fr))] below-portrait-2xs:w-max-[280px]
           portrait-2xs:gap-1 portrait-2xs:[grid-template-columns:repeat(1,minmax(200px,1fr))] portrait-2xs:w-max-[280px]
           portrait-xs:gap-1 portrait-xs:[grid-template-columns:repeat(1,minmax(300px,1fr))] portrait-xs:w-max-[380px]
           portrait-small:gap-[5px] portrait-small:[grid-template-columns:repeat(7,minmax(55px,55px))] portrait-small:w-max-[440px]
           portrait-medium:gap-2 portrait-medium:[grid-template-columns:repeat(7,minmax(70px,70px))] portrait-medium:w-max-[600px]
           portrait-large:gap-2 portrait-large:[grid-template-columns:repeat(7,minmax(80px,80px))] portrait-large:w-max-[700px]
           portrait-xl:gap-4 portrait-xl:[grid-template-columns:repeat(7,minmax(90px,90px))] portrait-xl:w-max-[800px]
           ">
      <WeekDayNameContainer
        v-for="(day, index) in daysOfWeek"
        :key="index"
        :day="day"
        v-if="!screenSize.isPortraitXsOr2Xs"
      />

      <EmptyDayContainer
          v-for="(index) in getDaysBefore()"
          :key="index"
          v-if="!screenSize.isPortraitXsOr2Xs"
      />

      <DayContainer
        v-for="(day, index) in monthStore.selected.days"
        :key="index"
        :day="day"
        @click="dayOpenerHandler(day)"
      />

      <EmptyDayContainer
          v-for="(index) in getDaysAfter()"
          :key="index"
          v-if="!screenSize.isPortraitXsOr2Xs"
      />
    </div>

    <ShiftAdderModal
        v-if="isShiftAdderOpen"
        :closeModal="closeShiftAdder"
        :date="dailyShifts.shiftsList?.date"
    />

    <ShiftsDetailsModal
        v-if="isDailyShiftsOpen"
        :key="modalKey"
        :closeModal="closeDailyShifts"
    />

</template>

<style scoped>


</style>
