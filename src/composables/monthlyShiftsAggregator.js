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

const groupShiftsByDate = (shifts, toils) => {
  const getDate = (dateTimeStr) => dateTimeStr.split('T')[0];

  return shifts.reduce((acc, shift) => {
    const date = getDate(shift.start);
    if (!acc[date]) {
      acc[date] = {
        list: [],
        totalShiftTime: 0,
        regular: 0,
        overtime: 0,
        toilTaken: 0
      };
    }
    acc[date].list.push(shift);
    acc[date].totalShiftTime += shift.work;

    const matchedToil = toils.find(overtime => getDate(overtime.date) === date);
    acc[date].toilTaken = matchedToil ? matchedToil : 0;

    return acc;
  }, {});
};

const calculateWorkAndOvertime = (groupedShifts, monthStore) => {
  let calculatedMonthlyRegularTime = 0;
  let calculatedMonthlyOvertime = 0;

  Object.keys(groupedShifts).forEach(date => {
    const totalShiftTime = groupedShifts[date].totalShiftTime;
    const splitOvertime = monthStore.splitOvertime(totalShiftTime);

    // get regular and overtime for each shift
    groupedShifts[date].list.forEach(shift => {
      const splitOvertime = splitTime(shift.work)
      shift.regular = splitOvertime?.regular || 0;
      shift.overtime = splitOvertime?.overtime || 0;
    })

    calculatedMonthlyRegularTime += splitOvertime?.regular || 0;
    calculatedMonthlyOvertime += splitOvertime?.overtime || 0;

    if (groupedShifts[date].toilTaken) {
      const ovTaken = (groupedShifts[date].toilTaken.hours || 0) * 3600;
      calculatedMonthlyOvertime -= ovTaken;
    }

    groupedShifts[date].regular = splitOvertime.regular;
    groupedShifts[date].overtime = splitOvertime.overtime;

  });

  monthStore.selected.monthlyRegularTime = calculatedMonthlyRegularTime;
  monthStore.selected.monthlyOvertime = calculatedMonthlyOvertime;
};

const updateMonthDays = (monthStore, groupedShifts) => {
  monthStore.daysInMonth = monthStore.daysInMonth.map(day => {
    const formattedDate = format(day.date, 'yyyy-MM-dd');
    const groupedShift = groupedShifts[formattedDate] || { list: [], regular: 0, toilTaken: 0 };
    return {
      ...day,
      shifts: groupedShift,
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