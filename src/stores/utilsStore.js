import {defineStore} from "pinia";
import {ref} from "vue";
import {eachDayOfInterval, endOfMonth, format, startOfMonth} from "date-fns";
import {fetchOvHistory, fetchUserShifts} from "@/composables/monthlyShiftsAggregator.js";
import {useAuthStore} from "@/stores/authStore.js";
import {usePrivilegedSelectedUser} from "@/stores/privilegedStore.js";
import {useRoute} from "vue-router";

export const useSelectedMonthStore = (id) =>
    defineStore(id, () => {

        const route = useRoute();
        const authUser = useAuthStore()
        const selectedUser = usePrivilegedSelectedUser();
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
                toil: {},
                offType: null,
            }));
        };

        const clear = () => {
            selected.value.monthlyRegularTime = 0;
            selected.value.monthlyOvertime = 0;
            selected.value.toils = 0;
            selected.value.days = [];
        }

        const splitTime = (shiftTime) => {
          const basic_work_time = 28800
          const regular_seconds = Math.min(shiftTime, basic_work_time)
          const overtimes_seconds = Math.max(shiftTime - basic_work_time, 0)
          return {regular: regular_seconds, overtime: overtimes_seconds};
        };

        const groupShiftsByDate = (shifts, toils) => {

            groupedShifts = shifts.reduce((acc, shift) => {

                const date = shift.start.split('T')[0]

                if (!acc[date]) {
                  acc[date] = {
                    date: date,
                    shifts: [],
                    work: 0,
                    regular: 0,
                    overtime: 0,
                    toil: {},
                    offType: null
                  };
                }

                acc[date].shifts.push(shift);

                acc[date].work += shift.work

                acc[date].offType = shift.off_type

                return acc;
            }, {});

            Object.values(groupedShifts).forEach(accDate => {
                const dtObj = new Date(accDate.date)
                const weekDay = dtObj.getDay() === 0 || dtObj.getDay() === 6;

                if (weekDay) {

                    accDate.overtime = accDate.work

                    selected.value.monthlyOvertime += accDate.overtime || 0;
                } else {

                    const splitTimeObj = splitTime(accDate.work);

                    accDate.regular = splitTimeObj?.regular || 0;
                    accDate.overtime = splitTimeObj?.overtime || 0;

                    selected.value.monthlyRegularTime += splitTimeObj?.regular || 0;
                    selected.value.monthlyOvertime += splitTimeObj?.overtime || 0;
                }

              });

            toils.forEach(toil => {
                const date = toil.date.split('T')[0];

                if (!groupedShifts[date]) {

                  groupedShifts[date] = {
                    date: date,
                    shifts: [],
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

            const ovHistory = await fetchOvHistory(authUser.user.id, prevMonth);

            selected.value.monthlyOvertime += (ovHistory && ovHistory?.length > 0 && ovHistory[0]?.overtime_seconds)
                ? ovHistory[0].overtime_seconds
                : 0;

            const isThisMonthClosed = await fetchOvHistory(authUser.user.id, currentMonth)

            selected.value.closed = isThisMonthClosed?.length > 0;
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

          const userID = route.name === 'Privileged' ? selectedUser.user?.id : authUser.user.id;

          const { shifts, toils } = await fetchUserShifts(userID, selected.value.month);

          groupShiftsByDate(shifts, toils);
          await addPrevOvertime()
          reduceToil(toils)

          selected.value.days = selected.value.days.map((day) => {
            const formattedDate = format(day.date, "yyyy-MM-dd");
            const shiftData = groupedShifts[formattedDate] || {};

            return {
                ...day,
                list: shiftData.shifts || [],
                regular: shiftData.regular || 0,
                overtime: shiftData.overtime || 0,
                toil: shiftData.toil || 0,
                offType: shiftData.offType || null
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

export const useLocationStore = defineStore('screenLocationStore', () => {
    const latitude = ref(null)
    const longitude = ref(null)
    const accuracy = ref(null)
    const errorMessage = ref('');

    const setLocation = (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        accuracy.value = position.coords.accuracy;
    };

    const getLocation = () => {
        return {
            'latitude': latitude.value,
            'longitude': longitude.value,
            'accuracy': accuracy.value
        }
    }

    const getCurrentLocation = async () => {
      if (!('geolocation' in navigator)) {
        errorMessage.value = 'Geolocation is not supported by this browser.';
        return;
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
          });
        });

        setLocation(position)

      } catch (error) {
        switch (error.code || error.message) {
          case 'PERMISSION_DENIED':
            errorMessage.value = 'User denied access to location.';
            break;
        case 'POSITION_UNAVAILABLE':
            errorMessage.value = 'Location information is unavailable.';
            break;
        case 'TIMEOUT':
            errorMessage.value = 'Location request timed out.';
            break;
        case 'UNKNOWN_ERROR':
            errorMessage.value = 'An unknown error occurred while determining the location.';
            break;
        default:
            errorMessage.value = `Error: ${error.message}`;
        }
      }
    }

    return {
        latitude,
        longitude,
        accuracy,
        setLocation,
        getLocation,
        getCurrentLocation
    };
});