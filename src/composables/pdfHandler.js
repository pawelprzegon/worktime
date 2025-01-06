import {getTime} from "@/composables/utils.js";

export const prepareStartAndStopTimePDF = (day, dayData) => {
  let start = ''
  let stop = ''

  dayData.forEach(shift => {

    const startTime = day.list.length > 0
      ? shift.start : '';

    const stopTime = day.list.length > 0
      ? shift.stop : '';

    start += start ? ', ' + getTime(startTime).slice(0, -3) : getTime(startTime).slice(0, -3)
    stop += stop ? ', ' + getTime(stopTime).slice(0, -3) : getTime(stopTime).slice(0, -3)

  })

  start = start ? start : ''
  stop = stop ? stop : ''

  return [start, stop]
}