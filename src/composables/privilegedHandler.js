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
