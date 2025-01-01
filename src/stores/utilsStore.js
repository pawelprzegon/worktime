import {defineStore} from "pinia";
import {ref} from "vue";
import {eachDayOfInterval, endOfMonth, format, startOfMonth} from "date-fns";
import {splitTime} from "@/composables/utils.js";
import {deleteShiftFetch} from "@/composables/fetchers.js";
import {fetchUserShifts} from "@/composables/monthlyShiftsAggregator.js";
import {useAuthStore} from "@/stores/authStore.js";


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

        const selectedUser = useAuthStore()
        let groupedShifts = []

        const selected = ref({
            month: new Date(),
            toils: 0,
            monthlyRegularTime: 0,
            monthlyOvertime: 0,
            days: []
        })

        const refresh = async () => {
            await processMonthlyShifts()
        }

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
            selected.value.monthlyRegularTime += splitTimeObj.regular;
            selected.value.monthlyOvertime += splitTimeObj.overtime;
            return splitTimeObj
        };

        const groupShiftsByDate = (shifts, toils) => {

          const getDate = (dateTimeStr) => dateTimeStr.split('T')[0];

          groupedShifts =  shifts.reduce((acc, shift) => {
            const date = getDate(shift.start);
            if (!acc[date]) {
              acc[date] = {
                shifts: {
                  date: null,
                  list: [],
                },
                totalShiftsTime: 0,
                regular: 0,
                overtime: 0,
                toilTaken: 0
              };
            }
            acc[date].shifts.list.push(shift);
            acc[date].totalShiftsTime += shift.work;

            // Oblicz regularne i nadgodziny
            const splitTimeObj = splitTime(shift.work);
            acc[date].regular += splitTimeObj.regular || 0;
            acc[date].overtime += splitTimeObj.overtime || 0;

            // Uwzględnij wykorzystany TOIL
            const matchedToil = toils.find(toil => getDate(toil.date) === date) || { hours: 0 };
            acc[date].toilTaken = matchedToil ? matchedToil : 0;
            return acc;
          }, {});
        };

        const calculateWorkAndOvertime = () => {

          let calculatedMonthlyRegularTime = 0;
          let calculatedMonthlyOvertime = 0;

          Object.keys(groupedShifts).forEach(date => {
            const totalShiftsTime = groupedShifts[date].totalShiftsTime;
            const _splitOvertime = splitOvertime(totalShiftsTime);

            // get regular and overtime for each shift
            groupedShifts[date].shifts.list.forEach(shift => {
             const shiftSplitOvertime = splitTime(shift.work);
              shift.regular = shiftSplitOvertime?.regular || 0;
              shift.overtime = shiftSplitOvertime?.overtime || 0;
            })

            calculatedMonthlyRegularTime += _splitOvertime?.regular || 0;
            calculatedMonthlyOvertime += _splitOvertime?.overtime || 0;

            if (groupedShifts[date]?.toilTaken.hours) {
              const ovTaken = (groupedShifts[date].toilTaken.hours * 3600 || 0);
              calculatedMonthlyOvertime -= ovTaken;
            }

            groupedShifts[date].regular = _splitOvertime?.regular || 0;
            groupedShifts[date].overtime = _splitOvertime?.overtime || 0;

          });

          selected.monthlyRegularTime = calculatedMonthlyRegularTime;
          selected.monthlyOvertime = calculatedMonthlyOvertime;
        };

        const updateMonthDays = () => {
          selected.value.days = selected.value.days.map(day => {
            const formattedDate = format(day.date, 'yyyy-MM-dd');
            const shiftData = groupedShifts[formattedDate] || {};

            return {
              ...day,
              list: shiftData.shifts?.list || [],
              regular: shiftData.regular || 0,
              overtime: shiftData.overtime || 0,
              toilTaken: shiftData.toilTaken || 0,
            };
          });
        };

        const processMonthlyShifts = async () => {
            clear();
            updateDaysInMonth()
            const { shifts, toils } = await fetchUserShifts(selectedUser.user.id, selected.value.month);
            groupShiftsByDate(shifts, toils);
            calculateWorkAndOvertime();
            updateDaysInMonth()
            updateMonthDays();

            return true;
        };

        return {
            selected,
            refresh,
            updateDaysInMonth,
            processMonthlyShifts
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