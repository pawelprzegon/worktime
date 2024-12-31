import {defineStore} from "pinia";
import {ref} from "vue";
import {eachDayOfInterval, endOfMonth, format, startOfMonth} from "date-fns";
import {splitTime} from "@/composables/utils.js";
import {deleteShiftFetch} from "@/composables/fetchers.js";

export const useSelectedDayStore = (id) =>
  defineStore(id, () => {
    const month = ref(new Date());
    const toils = ref(0);

    const setMonth = (newMonth) => {
      month.value = newMonth;
    };

    const daysInMonth = ref([]);

    const updateDaysInMonth = () => {
      daysInMonth.value = eachDayOfInterval({
        start: startOfMonth(month.value),
        end: endOfMonth(month.value),
      }).map(date => ({
        date,
        hours: 0,
        note: '',
        shifts: { list: [], summary: 0 }
      }));
    };

    return {
        month,
        toils,
        daysInMonth,
        updateDaysInMonth,
        setMonth,
    };
  })();

export const useSelectedMonthStore = (id) =>
  defineStore(id, () => {

    const selected = ref({
        month: new Date(),
        toils: 0,
        monthlyRegularTime: 0,
        monthlyOvertime: 0,
        days: []
    })

    const updateDaysInMonth = () => {
      selected.value.days = eachDayOfInterval({
        start: startOfMonth(selected.value.month),
        end: endOfMonth(selected.value.month),
      }).map(date => ({
        date: date,
        list: [],
        regular: 0,
        overtime: 0,
        toilTaken: 0,
      }));
    };

    const clear = () => {
        selected.value.monthlyRegularTime = 0;
        selected.value.monthlyOvertime = 0;
        selected.value.toils = 0;
        selected.value.days = [];
    }

    const splitOvertime = (shiftTime) => {
        const splitTimeObj = splitTime(shiftTime)
        selected.monthlyRegularTime += splitTimeObj.regular;
        selected.monthlyOvertime += splitTimeObj.overtime;
      return splitTimeObj
    };

    return {
        selected,
        updateDaysInMonth,
        clear,
        splitOvertime
    };
  })();

export const useScreenSizeStore = defineStore('screenSizeStore', () => {
    const isPortraitXsOr2Xs = ref(false)
    const isPortraitSmall = ref(false)

    const setSize = (newSize) => {
    isPortraitXsOr2Xs.value = newSize < 480;
    isPortraitSmall.value = newSize < 768;
    };

    return {
    isPortraitXsOr2Xs,
    isPortraitSmall,
    setSize,
    };
});
