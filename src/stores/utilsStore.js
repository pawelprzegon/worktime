import {defineStore} from "pinia";
import {ref} from "vue";
import {eachDayOfInterval, endOfMonth, format, startOfMonth} from "date-fns";
import {splitTime} from "@/composables/utils.js";
import {fetchOvHistory, fetchUserShifts} from "@/composables/monthlyShiftsAggregator.js";
import {useAuthStore} from "@/stores/authStore.js";

// To jest używane tylko i wyłącznie przez previliged
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
            days: [],
            closed: false
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
                toil: 0,
            }));
        };

        const clear = () => {
            selected.value.monthlyRegularTime = 0;
            selected.value.monthlyOvertime = 0;
            selected.value.toils = 0;
            selected.value.days = [];
        }

        const groupShiftsByDate = (shifts, toils) => {

            groupedShifts = shifts.reduce((acc, shift) => {

                const date = shift.start.split('T')[0]

                if (!acc[date]) {
                  acc[date] = {
                    shifts: { date, list: [] },
                    regular: 0,
                    overtime: 0,
                    toil: 0,
                  };
                }

                acc[date].shifts.list.push(shift);

                const splitTimeObj = splitTime(shift.work);

                acc[date].regular += splitTimeObj?.regular || 0;
                acc[date].overtime += splitTimeObj?.overtime || 0;

                selected.value.monthlyRegularTime += splitTimeObj?.regular || 0;
                selected.value.monthlyOvertime += splitTimeObj?.overtime || 0;
                return acc;
            }, {});

            toils.forEach((toil) => {
                const date = toil.date.split('T')[0];

                if (!groupedShifts[date]) {

                  groupedShifts[date] = {
                    shifts: { date, list: [] },
                    regular: 0,
                    overtime: 0,
                    toil: toil,
                  };

                } else {
                    groupedShifts[date].toil = toil
                }

              });

        };

        const addPrevOvertime = async () => {
            const currentMonth = new Date(selected.value.month);
            let prevMonth = new Date(selected.value.month)
            prevMonth.setMonth(prevMonth.getMonth() - 1);

            const ovHistory = await fetchOvHistory(selectedUser.user.id, prevMonth);

             selected.value.monthlyOvertime += (ovHistory && ovHistory.length > 0 && ovHistory[0]?.overtime_seconds)
                ? ovHistory[0].overtime_seconds
                : 0;

             const isThisMonthClosed = await fetchOvHistory(selectedUser.user.id, currentMonth)
             selected.value.closed = isThisMonthClosed.length > 0;
        }

        const reduceToil = (toils) => {

            const currentYearMonth = selected.value.month.toISOString().slice(0, 7);

            toils.forEach((toil) => {
                const toilYearMonth = typeof toil.date === 'string' ?
                                      toil.date.slice(0, 7) :
                                      new Date(toil.date).toISOString().slice(0, 7);

                if (toilYearMonth === currentYearMonth) {
                    selected.value.monthlyOvertime -= toil?.duration_seconds || 0;
                }

                selected.value.toils += toil?.duration_seconds || 0;
            });
        };

        const processMonthlyShifts = async () => {
          clear();
          updateDaysInMonth();

          const { shifts, toils } = await fetchUserShifts(selectedUser.user.id, selected.value.month);
          groupShiftsByDate(shifts, toils);
          await addPrevOvertime()
          reduceToil(toils)
          selected.value.days = selected.value.days.map((day) => {
            const formattedDate = format(day.date, "yyyy-MM-dd");
            const shiftData = groupedShifts[formattedDate] || {};

            return {
              ...day,
              list: shiftData.shifts?.list || [],
              regular: shiftData.regular || 0,
              overtime: shiftData.overtime || 0,
              toil: shiftData.toil || 0,
            };
          });

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