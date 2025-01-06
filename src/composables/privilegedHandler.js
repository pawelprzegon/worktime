import { format} from "date-fns";
import {formatTime, getLast, getTime} from "@/composables/utils.js";

const baseShiftTime = 28800

export const monthMapper = (monthAsNumber) => {

  switch (monthAsNumber) {
    case '01':
      return 'Styczeń';
    case '02':
      return 'Luty';
    case '03':
      return 'Marzec';
    case '04':
      return 'Kwiecień';
    case '05':
      return 'Maj';
    case '06':
      return 'Czerwiec';
    case '07':
      return 'Lipiec';
    case '08':
      return 'Sierpień';
    case '09':
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
    const startTime = day.list.length > 0
      ? shift.start : '-';

    const stopTime = day.list.length > 0
      ? shift.stop : '-';

    start += `<p>${getTime(startTime)}</p>`
    stop += `<p>${getTime(stopTime)}</p>`

  })

  start = start ? start : ''
  stop = stop ? stop : ''

  return [start, stop]
}

export const calculateTime = (day) => {

  const formattedDate = format(day.date, 'yyyy-MM-dd');
  const overtime = day.overtime ? formatTime(day.overtime) : '';
  const toil = day.toil ? formatTime(day.toil.duration_seconds) : '';
  const regular = day.regular ? formatTime(day.regular) : "";

  let result = `<td>${formattedDate}</td>`
  const dayData = getLast(day)

  const [start, stop] = prepareStartAndStopTime(day, dayData)
  result += `
    <td class="multiple-data">${start ? start : ''}</td>
    <td class="multiple-data">${stop ? stop : ''}</td>
  `

  if ((day.regular + (day.toil?.duration_seconds || 0)) >= baseShiftTime) {
    result += `<td class="achieved">${regular}</td>`
  } else {
    result += `<td class="not-achieved">${regular}</td>`
  }
  result += `<td>${overtime}</td>`

  if ((day.regular + (day.toil?.duration_seconds || 0)) >= baseShiftTime) {
    result += `<td class="achieved">${toil}</td>`
  } else {
    result += `<td class="not-achieved">${toil}</td>`
  }

  return result;
};