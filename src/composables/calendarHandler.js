import {deleteShiftFetch, getOvertime, getUserShifts} from "@/fetchers.js";
import {format, sub, add} from "date-fns";


export const getData = async (selectedUser, selectedMonth, monthTime) => {
  monthTime.clear()
  selectedMonth.calculatedWorkTime = 0;
  selectedMonth.calculatedOvertimeTime = 0;

  try {
    const shifts = await getUserShifts(selectedUser.user._id, selectedMonth.month);
    const overtimes = await getOvertime(selectedUser.user._id, selectedMonth.month);

    const getDate = (dateTimeStr) => dateTimeStr.split('T')[0];

    const groupedShifts = shifts.reduce((acc, shift) => {
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
      acc[date].overtimeTaken = overtimes.filter(overtime => getDate(overtime.date) === date)[0]
      return acc;
    }, {});

    Object.keys(groupedShifts).forEach(date => {

      const totalWork = groupedShifts[date].totalWork;
      const splitOvertime = monthTime.splitOvertime(totalWork)

      if (groupedShifts[date].overtimeTaken){
        const ovTaken = groupedShifts[date].overtimeTaken.hours * 3600
        monthTime.subOvertime(ovTaken)
      }

      groupedShifts[date].regular = splitOvertime.work;
      groupedShifts[date].overtime = splitOvertime.overtime;

    });

    selectedMonth.daysInMonth = selectedMonth.daysInMonth.map(day => {
      const formattedDate = format(day.date, 'yyyy-MM-dd');
      const groupedShift = groupedShifts[formattedDate] || { list: [], regular: 0};
      return {
        ...day,
        shifts: groupedShift,
      };
    });

    return true

  } catch (error) {
    console.error("Error fetching users:", error);
    return false
  }
};

export const removeShift = async (shiftId, selectedDay, alert) => {
  try {
    const response = await deleteShiftFetch(shiftId);
    if (response) {
      selectedDay.value.shifts.list = selectedDay.value.shifts.list.filter(
        (shift) => shift.id !== shiftId
      );
      alert.show(response.status, response.message);
    }

    alert.show(response.status, response.message);
  } catch (error) {
    console.error("Error removing shift:", error);
    alert.show("error", "Failed to remove shift.");
  }
};