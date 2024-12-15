import { format} from "date-fns";
import {formatTime, getLast, getTime} from "@/composables/utils.js";

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