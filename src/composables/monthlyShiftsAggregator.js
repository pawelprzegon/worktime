import {getOvertime, getUserShifts} from "@/composables/fetchers.js";
import {format} from "date-fns";

export const fetchUserShifts = async (userId, month) => {
  try {
    const shifts = await getUserShifts(userId, month);
    const overtimes = await getOvertime(userId, month);
    return { shifts, overtimes };
  } catch (error) {
    console.error("Error fetching shifts or overtime:", error);
    return { shifts: [], overtimes: [] };
  }
};

const groupShiftsByDate = (shifts, overtimes) => {
  const getDate = (dateTimeStr) => dateTimeStr.split('T')[0];

  return shifts.reduce((acc, shift) => {
    const date = getDate(shift.start);
    if (!acc[date]) {
      acc[date] = {
        list: [],
        totalWork: 0,
        overtime: {}
      };
    }
    acc[date].list.push(shift);
    acc[date].totalWork += shift.work;

    const matchedOvertime = overtimes.find(overtime => getDate(overtime.date) === date);
    acc[date].overtimeTaken = matchedOvertime ? matchedOvertime : null;

    return acc;
  }, {});
};

const calculateWorkAndOvertime = (groupedShifts, monthTime) => {
  let calculatedWorkTime = 0;
  let calculatedOvertimeTime = 0;

  Object.keys(groupedShifts).forEach(date => {
    const totalWork = groupedShifts[date].totalWork;
    const splitOvertime = monthTime.splitOvertime(totalWork);

    calculatedWorkTime += splitOvertime.work;
    calculatedOvertimeTime += splitOvertime.overtime;

    if (groupedShifts[date].overtimeTaken) {
      const ovTaken = (groupedShifts[date].overtimeTaken.hours || 0) * 3600;
      calculatedOvertimeTime -= ovTaken;
    }

    groupedShifts[date].regular = splitOvertime.work;
    groupedShifts[date].overtime = splitOvertime.overtime;
  });

  return { calculatedWorkTime, calculatedOvertimeTime };
};

const updateMonthDays = (selectedMonth, groupedShifts) => {
  selectedMonth.daysInMonth = selectedMonth.daysInMonth.map(day => {
    const formattedDate = format(day.date, 'yyyy-MM-dd');
    const groupedShift = groupedShifts[formattedDate] || { list: [], regular: 0, overtimeTaken: null };
    return {
      ...day,
      shifts: groupedShift,
    };
  });
};

export const processMonthlyShifts = async (selectedUser, selectedMonth, monthTime) => {
  monthTime.clear();
  selectedMonth.calculatedWorkTime = 0;
  selectedMonth.calculatedOvertimeTime = 0;

  const { shifts, overtimes } = await fetchUserShifts(selectedUser.user._id, selectedMonth.month);

  const groupedShifts = groupShiftsByDate(shifts, overtimes);

  const { calculatedWorkTime, calculatedOvertimeTime } = calculateWorkAndOvertime(groupedShifts, monthTime);

  selectedMonth.calculatedWorkTime = calculatedWorkTime;
  selectedMonth.calculatedOvertimeTime = calculatedOvertimeTime;
  selectedMonth.updateDaysInMonth()

  updateMonthDays(selectedMonth, groupedShifts);
  console.log('done')
  return true;
};