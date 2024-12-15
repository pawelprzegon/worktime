import {getOvertime, getUserShifts} from "@/fetchers.js";
import {formatTime, getLast, getTime} from "@/utils.js";
import { format} from "date-fns";



const baseShiftTime = 28800

export const monthMapper = (monthAsNumber) => {
  switch (monthAsNumber) {
    case '1':
      return 'Styczeń';
    case '2':
      return 'Luty';
    case '3':
      return 'Marzec';
    case '4':
      return 'Kwiecień';
    case '5':
      return 'Maj';
    case '6':
      return 'Czerwiec';
    case '7':
      return 'Lipiec';
    case '8':
      return 'Sierpień';
    case '9':
      return 'Wrzesień';
    case '10':
      return 'Październik';
    case '11':
      return 'Listopad';
    case '12':
      return 'Grudzień';
    default:
      return 'Nieprawidłowy miesiąc';
  }
};

export const transposeTable = (headers, body) => {
    return headers.map((header, i) => [
      header,
      ...body.map(row => row[i] || ""),
  ]);
};

export const getData = async (selectedUser, selectedMonth) => {

      let calculatedWorkTime = 0;
      let calculatedOvertimeTime = 0;

      try {
        const shifts = await getUserShifts(selectedUser.user._id, selectedMonth.month);
        const overtimes = await getOvertime(selectedUser.user._id, selectedMonth.month);

        const getDate = (dateTimeStr) => dateTimeStr.split('T')[0];

        const splitOverTime = (shiftTime) => {
          if (shiftTime <= baseShiftTime) {
            return {'work': shiftTime, 'overtime': 0};
          } else {
            return {'work': baseShiftTime, 'overtime': shiftTime - baseShiftTime};
          }
        };

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
          const matchedOvertime = overtimes.filter(overtime => getDate(overtime.date) === date)[0];
          acc[date].overtimeTaken = matchedOvertime ? matchedOvertime : null;
          return acc;
        }, {});

        Object.keys(groupedShifts).forEach(date => {

          const totalWork = groupedShifts[date].totalWork;
          const splitOvertime = splitOverTime(totalWork);

          calculatedWorkTime += splitOvertime.work;
          calculatedOvertimeTime += splitOvertime.overtime;

          if (groupedShifts[date].overtimeTaken){
            const ovTaken = (groupedShifts[date].overtimeTaken.hours || 0) * 3600;
            calculatedOvertimeTime -= ovTaken
          }

          groupedShifts[date].regular = splitOvertime.work;
          groupedShifts[date].overtime = splitOvertime.overtime;

        });

        selectedMonth.daysInMonth = selectedMonth.daysInMonth.map(day => {
          const formattedDate = format(day.date, 'yyyy-MM-dd');
          const groupedShift = groupedShifts[formattedDate] || { list: [], regular: 0, overtimeTaken: null};
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

const prepareStartAndStopTime = (day, dayData) => {
  let start = ''
  let stop = ''

  dayData.forEach(shift => {

    const startTime = day.shifts.list.length > 0
      ? shift.startTime : '-';

    const stopTime = day.shifts.list.length > 0
      ? shift.stopTime : '-';

    start += `<p>${getTime(startTime)}</p>`
    stop += `<p>${getTime(stopTime)}</p>`

  })

  start = start ? start : '-'
  stop = stop ? stop : '-'

  return [start, stop]
}

export const calculateTime = (day) => {
  const formattedDate = format(day.date, 'yyyy-MM-dd');
  const overtime = day.shifts.overtime ? formatTime(day.shifts.overtime) : ''
  const overtimeHours = day.shifts.overtimeTaken?.hours || 0
  const regularTime = day.shifts.regular ? formatTime(day.shifts.regular) : ""

  let result = `<td>${formattedDate}</td>`
  const dayData = getLast(day)

  const [start, stop] = prepareStartAndStopTime(day, dayData)

  result += `
    <td class="multiple-data">${start}</td>
    <td class="multiple-data">${stop}</td>
  `

  if ((day.shifts.regular) >= baseShiftTime) {
    result += `<td class="achieved">${regularTime}</td>`
  } else {
    result += `<td class="not-achieved">${regularTime}</td>`
  }
  result += `<td>${overtime ? overtime : ''}</td>`
  result += `<td>${overtimeHours ? overtimeHours : ''}</td>`
  return result;
};