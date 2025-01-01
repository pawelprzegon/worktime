import {getToil, getUserShifts} from "@/composables/fetchers.js";
import {format} from "date-fns";
import {splitTime} from "@/composables/utils.js";

export const fetchUserShifts = async (userId, month) => {
  try {
    const shifts = await getUserShifts(userId, month);
    const toils = await getToil(userId, month);
    return { shifts, toils };
  } catch (error) {
    console.error("Error fetching shifts or overtime:", error);
    return { shifts: [], toils: [] };
  }
};

export const groupShiftsByDate = (shifts, toils) => {
  const getDate = (dateTimeStr) => dateTimeStr.split('T')[0];

  return shifts.reduce((acc, shift) => {
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
    const matchedToil = toils.find(toil => getDate(toil.date) === date);
    acc[date].toilTaken = matchedToil ? matchedToil : 0;
    return acc;
  }, {});
};

const calculateWorkAndOvertime = (groupedShifts, monthStore) => {
  let calculatedMonthlyRegularTime = 0;
  let calculatedMonthlyOvertime = 0;

  Object.keys(groupedShifts).forEach(date => {
    const totalShiftsTime = groupedShifts[date].totalShiftsTime;
    const splitOvertime = monthStore.splitOvertime(totalShiftsTime);

    // get regular and overtime for each shift
    groupedShifts[date].shifts.list.forEach(shift => {
     const shiftSplitOvertime = splitTime(shift.work);
      shift.regular = shiftSplitOvertime?.regular || 0;
      shift.overtime = shiftSplitOvertime?.overtime || 0;
    })

    calculatedMonthlyRegularTime += splitOvertime?.regular || 0;
    calculatedMonthlyOvertime += splitOvertime?.overtime || 0;

    if (groupedShifts[date].toilTaken.hours) {
      const ovTaken = (groupedShifts[date].toilTaken.hours * 3600 || 0);
      calculatedMonthlyOvertime -= ovTaken;
    }

    groupedShifts[date].regular = splitOvertime?.regular || 0;
    groupedShifts[date].overtime = splitOvertime?.overtime || 0;

  });

  monthStore.selected.monthlyRegularTime = calculatedMonthlyRegularTime;
  monthStore.selected.monthlyOvertime = calculatedMonthlyOvertime;
};

const updateMonthDays = (monthStore, groupedShifts) => {
  monthStore.selected.days = monthStore.selected.days.map(day => {
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

export const processMonthlyShifts = async (selectedUser, monthStore) => {
  monthStore.clear();

  const { shifts, toils } = await fetchUserShifts(selectedUser.user.id, monthStore.selected.month);

  const groupedShifts = groupShiftsByDate(shifts, toils);

  calculateWorkAndOvertime(groupedShifts, monthStore);

  monthStore.updateDaysInMonth()

  updateMonthDays(monthStore, groupedShifts);

  return true;
};