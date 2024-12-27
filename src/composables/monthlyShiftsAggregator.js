import {getToil, getUserShifts} from "@/composables/fetchers.js";
import {format} from "date-fns";
import {formatTime, splitTime} from "@/composables/utils.js";

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

const groupShiftsByDate = (shifts, overtimes) => {
  const getDate = (dateTimeStr) => dateTimeStr.split('T')[0];

  return shifts.reduce((acc, shift) => {
    const date = getDate(shift.start);
    if (!acc[date]) {
      acc[date] = {
        list: [],
        totalShiftTime: 0,
        regular: 0,
        overtime: 0
      };
    }
    acc[date].list.push(shift);
    acc[date].totalShiftTime += shift.work;

    const matchedOvertime = overtimes.find(overtime => getDate(overtime.date) === date);
    acc[date].overtimeTaken = matchedOvertime ? matchedOvertime : 0;

    return acc;
  }, {});
};

const calculateWorkAndOvertime = (groupedShifts, monthTime) => {
  let calculatedMonthlyWorkTime = 0;
  let calculatedMonthlyOvertimeTime = 0;

  Object.keys(groupedShifts).forEach(date => {
    const totalShiftTime = groupedShifts[date].totalShiftTime;
    const splitOvertime = monthTime.splitOvertime(totalShiftTime);

    // get regular and overtime for each shift
    groupedShifts[date].list.forEach(shift => {
      const splitOvertime = splitTime(shift.work)
      shift.regular = splitOvertime?.regular || 0;
      shift.overtime = splitOvertime?.overtime || 0;
    })

    calculatedMonthlyWorkTime += splitOvertime?.regular || 0;
    calculatedMonthlyOvertimeTime += splitOvertime?.overtime || 0;

    if (groupedShifts[date].overtimeTaken) {
      const ovTaken = (groupedShifts[date].overtimeTaken.hours || 0) * 3600;
      calculatedMonthlyOvertimeTime -= ovTaken;
    }

    groupedShifts[date].regular = splitOvertime.regular;
    groupedShifts[date].overtime = splitOvertime.overtime;

  });

  return { calculatedMonthlyWorkTime, calculatedMonthlyOvertimeTime };
};

const updateMonthDays = (selectedMonth, groupedShifts) => {
  selectedMonth.daysInMonth = selectedMonth.daysInMonth.map(day => {
    const formattedDate = format(day.date, 'yyyy-MM-dd');
    const groupedShift = groupedShifts[formattedDate] || { list: [], regular: 0, overtimeTaken: 0 };
    return {
      ...day,
      shifts: groupedShift,
    };
  });
};

export const processMonthlyShifts = async (selectedUser, selectedMonth, monthTime) => {
  monthTime.clear();
  selectedMonth.calculatedMonthlyWorkTime = 0;
  selectedMonth.calculatedMonthlyOvertimeTime = 0;

  const { shifts, toils } = await fetchUserShifts(selectedUser.user.id, selectedMonth.month);

  const groupedShifts = groupShiftsByDate(shifts, toils);

  const { calculatedMonthlyWorkTime, calculatedMonthlyOvertimeTime } = calculateWorkAndOvertime(groupedShifts, monthTime);

  selectedMonth.calculatedMonthlyWorkTime = calculatedMonthlyWorkTime;
  selectedMonth.calculatedMonthlyOvertimeTime = calculatedMonthlyOvertimeTime;
  selectedMonth.updateDaysInMonth()

  updateMonthDays(selectedMonth, groupedShifts);
  return true;
};