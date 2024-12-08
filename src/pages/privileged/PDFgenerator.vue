<script setup>
import jsPDF from "jspdf";
import "jspdf-autotable";
import {onMounted, ref, watch} from "vue";
import {add, eachDayOfInterval, endOfMonth, format, startOfMonth, sub} from "date-fns";
import {getOvertime, getUserShifts} from "@/fetchers.js";
import {formatTime, getLastStartStop, range, getTime} from "@/utils.js";
import CustomNaviButton from "@/components/CustomNaviButton.vue";
import robotoFont from "@/assets/font/Roboto-Light-normal.js"
import {daysOff, leaveTypes, other} from "@/data/privileged_data.js";
import {useSelectedUser, useSelectedMonth} from "@/stores/privileged.js";

const selectedUser = useSelectedUser()
const selectedMonth = useSelectedMonth()

const baseShiftTime = 28800
const baseShiftDelta = 900

const calculatedWorkTime = ref(0)
const calculatedOvertimeTime = ref(0)
const startDay = ref(null);
const daysBeforeRange = ref(null);
const endDay = ref(null);
const daysAfterRange = ref(null);

const daysInMonth = ref(
  eachDayOfInterval({
    start: startOfMonth(selectedMonth.month),
    end: endOfMonth(selectedMonth.month),
  }).map(date => ({
    date,
    hours: 0,
    note: '',
    shifts: { list: [], summary: 0 }
  }))
);


const updateDaysInMonth = () => {
  daysInMonth.value = eachDayOfInterval({
    start: startOfMonth(selectedMonth.month),
    end: endOfMonth(selectedMonth.month),
  }).map(date => ({
    date,
    hours: 0,
    note: '',
    shifts: { list: [], summary: 0 }
  }));
};

const prevMonth = () => {
  selectedMonth.month = sub(selectedMonth.month, { months: 1 });
  updateDaysInMonth();
  getDates()
};

const nextMonth = () => {
  selectedMonth.month = add(selectedMonth.month, { months: 1 });
  updateDaysInMonth();
  getDates()

};

const getDates = async () => {
  calculatedWorkTime.value = 0;
  calculatedOvertimeTime.value = 0;

  try {
    const shifts = await getUserShifts(selectedUser.user._id, selectedMonth.month);
    const overtimes = await getOvertime(selectedUser.user._id, selectedMonth.month);

    startDay.value = new Date(daysInMonth.value[0]['date']).getDay() || 7;
    endDay.value = new Date(daysInMonth.value[daysInMonth.value.length - 1]['date']).getDay() || 7;
    daysBeforeRange.value = range(2, startDay.value);
    daysAfterRange.value = range(endDay.value, 6);

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

      calculatedWorkTime.value += splitOvertime.work;
      calculatedOvertimeTime.value += splitOvertime.overtime;

      if (groupedShifts[date].overtimeTaken){
        const ovTaken = (groupedShifts[date].overtimeTaken.hours || 0) * 3600;
        calculatedOvertimeTime.value -= ovTaken
      }

      groupedShifts[date].regular = splitOvertime.work;
      groupedShifts[date].overtime = splitOvertime.overtime;

    });

    daysInMonth.value = daysInMonth.value.map(day => {
      const formattedDate = format(day.date, 'yyyy-MM-dd');
      const groupedShift = groupedShifts[formattedDate] || { list: [], regular: 0, overtimeTaken: null};
      return {
        ...day,
        shifts: groupedShift,
      };
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

watch(
  () => selectedUser.user,
  (newValue, oldValue) => {
    console.log('User changed:', newValue, oldValue);
    getDates();
  },
  { deep: true }
);

onMounted(() => {
  if (selectedUser.user) {
    getDates();
  }
});

const prepareStartAndStopTimePDF = (day, dayData) => {
  let start = ''
  let stop = ''

  dayData.forEach(shift => {

    const startTime = day.shifts.list.length > 0
      ? shift.startTime : '';

    const stopTime = day.shifts.list.length > 0
      ? shift.stopTime : '';

    start += start ? ', ' + getTime(startTime).slice(0, -3) : getTime(startTime).slice(0, -3)
    stop += stop ? ', ' + getTime(stopTime).slice(0, -3) : getTime(stopTime).slice(0, -3)

  })

  start = start ? start : ''
  stop = stop ? stop : ''

  return [start, stop]
}

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

const transposeTable = (headers, body) => {
  // Tworzenie nowej struktury tabeli z transpozycją
  const transposed = headers.map((header, i) => [
    header,
    ...body.map(row => row[i] || ""),
  ]);
  return transposed;
};

const monthMapper = (monthAsNumber) => {
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

const generatePDF = () => {
  const monthYear = `${monthMapper(format(selectedMonth.month, 'MM'))}-${format(selectedMonth.month, 'yyyy')}`
  let totalHours = 0
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.width;
  const tableWidth = (pageWidth / 3) * 0.8;
  doc.addFileToVFS("Roboto-Light-normal.ttf", robotoFont);
  doc.addFont("Roboto-Light-normal.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

  // Dodanie tytułu i imienia/nazwiska
  doc.setFontSize(16);
  doc.text(`Harmonogram czasu pracy: ${monthYear}`, 10, 10);
  doc.setFontSize(12);
  doc.text(`${props.user.first_name} ${props.user.last_name}`, 10, 20);

  // Nagłówki tabeli
  const headers = [
      "Rozpoczęcie",
      "Zakończenie",
      "Czas pracy",
      "Dni wolne",
      "Urlopy (rodzaj i wymiar)",
      "Choroba",
      "Inne zasiłkowe (rodzaj i wymiar)",
      "Nieobecności usprawiedliwione (rodzaj i wymiar)",
      "płatne",
      "niepłatne",
      "Nieobecności nieusprawiedliwione (wymiar)",
  ];

  // Dane tabeli
  const tableBody = daysInMonth.value.map(day => {

    const calculateWorkTime = () => {
      if (!day.shifts.regular) {
        return ''
      }

      if (day.shifts.overtimeTaken) {
        if ((day.shifts.regular + day.shifts.overtimeTaken.hours * 3600) >= baseShiftTime - baseShiftDelta) {
          return baseShiftTime
        }
        return day.shifts.regular + day.shifts.overtimeTaken.hours * 3600
      }

      if (day.shifts.regular >= baseShiftTime - baseShiftDelta) {
        return baseShiftTime
      }
      return day.shifts.regular
    }

    let start = '';
    let stop = '';
    const dayData = getLast(day);
    // jeżeli czas pracy z odebranymi nadgodzinami jest dłuższy od 7h 45min to robimy 8-16
    if (day.shifts.regular + ((day.shifts.overtimeTaken?.hours || 0) * 3600) >= baseShiftTime - baseShiftDelta) {
      start = formatTime(baseShiftTime).slice(0, -3);
      stop = formatTime(baseShiftTime * 2).slice(0, -3);
    // Jeżeli czas pracy jest mniejszy od 7h 45min to robimy tak jak jest
    } else if (day.shifts.regular < baseShiftTime - baseShiftDelta) {
      [start, stop] = prepareStartAndStopTimePDF(day, dayData);
    }
    let workTime = calculateWorkTime()
    if (typeof(workTime) === "number") {
      totalHours += workTime
    }

    workTime = workTime ? formatTime(workTime) : ''
    return [start, stop, workTime.slice(0, -3)];
  });

  const summaryRow = ['', '', formatTime(totalHours).slice(0, -3)];
  tableBody.push(summaryRow);

  // Transpozycja tabeli
  const transposedTable = transposeTable(headers, tableBody);

  // Dodanie tabeli
  doc.autoTable({
    head: [["", ...daysInMonth.value.map(day => format(day.date, 'dd')), "Razem"]],
    body: transposedTable,
    startY: 30,
    tableWidth: 'auto',
    columnStyles: {
      0: {cellWidth: 20},
      default: {cellWidth: 9},
    },
    textAlign: "center",
    styles: {
      equalColumnWidth: false,
      font: "Roboto",
      fontSize: 5,
      lineColor: [90, 90, 90],
      lineWidth: 0.1,
      halign: 'center',
    },
    headStyles: {
      font: "Roboto",
      fontSize: 7,
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      halign: 'center',
    },
  });

  doc.text("Oznaczenia:", 10, 120);

  doc.autoTable({
    head: [["Kod", "Opis"]],
    body: leaveTypes.map(item => [item.code, item.description]),
    startY: 130,
    pageBreakBefore: false,
    tableWidth: tableWidth,
    columnStyles: {
      0: { cellWidth: 20 },
      default: { cellWidth: 9 }
    },
    textAlign: "center",
    styles: {
      cellHeight: 4,
      equalColumnWidth: false,
      font: "Roboto",
      fontSize: 4,
      halign: 'center',
      cellPadding: 1
    },
    headStyles: {
      font: "Roboto",
      fontSize: 5,
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      halign: 'center'
    },
    margin: { left: 25 }  // Przesunięcie drugiej tabeli na prawo
  });

  // Dodanie trzeciej tabeli (przesunięcie jeszcze bardziej w prawo)
  doc.autoTable({
    head: [["Kod", "Opis"]],
    body: daysOff.map(item => [item.code, item.description]),
    startY: 130,
    pageBreakBefore: false,
    tableWidth: tableWidth,
    columnStyles: {
      0: { cellWidth: 20 },
      default: { cellWidth: 9 }
    },
    textAlign: "center",
    styles: {
      cellHeight: 4,
      equalColumnWidth: false,
      font: "Roboto",
      fontSize: 4,
      halign: 'center',
      cellPadding: 1
    },
    headStyles: {
      font: "Roboto",
      fontSize: 5,
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      halign: 'center'
    },
    margin: { left: tableWidth + 30 }  // Przesunięcie trzeciej tabeli na prawo
  });

  // Przesuń do pozycji poziomej dla trzeciej tabeli
  doc.autoTable({
    head: [["Kod", "Opis"]],
    body: other.map(item => [item.code, item.description]),
    startY: 130,
    pageBreakBefore: false,
    tableWidth: tableWidth,
    columnStyles: {
      0: {cellWidth: 20},
      default: {cellWidth: 9},
    },
    textAlign: "center",
    styles: {
      cellHeight: 4,
      equalColumnWidth: false,
      font: "Roboto",
      fontSize: 4,
      halign: 'center',
      cellPadding: 1
    },
    headStyles: {
      font: "Roboto",
      fontSize: 5,
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      halign: 'center',
    },
    margin: { left: tableWidth * 2 + 35 }
  });

  // Zapisanie pliku PDF
  doc.save(`${props.user.first_name}_${props.user.last_name}-${monthYear}.pdf`);
};


const getLast = (day) => {
  let shifts = []
  day.shifts.list.forEach(shift => {
    let obj = {
      startTime: Number,
      stopTime: Number,
    }
    obj.startTime = getLastStartStop(shift, 'start')
    obj.stopTime = getLastStartStop(shift, 'stop')
    shifts.push(obj)
  })
  return shifts
}


const calculateTime = (day) => {
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

</script>

<template>
  <div v-if="selectedUser.user">
    <button @click="generatePDF">Get Harmonogram</button>

    <h1>{{selectedUser.user.first_name}} {{selectedUser.user.last_name}}</h1>

    <div class="calendar-navigation">
      <CustomNaviButton direction="preview" size="20" @click="prevMonth"/>
      <span class="nav-label">{{ format(selectedMonth.month, 'MMMM yyyy') }}</span>
      <CustomNaviButton direction="next" size="20" @click="nextMonth"/>
    </div>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Start time</th>
          <th>Stop time</th>
          <th>Regular Work time</th>
          <th>Over time</th>
          <th>Overtime taken</th>
        </tr>
      </thead>
      <tbody>
        <tr
            v-for="(day, index) in daysInMonth"
            :key="index"
            v-html="calculateTime(day)"
        >
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

/* Styl całej tabeli */
table {
  width: 800px;
  border-collapse: collapse; /* Usuwa przerwy między ramkami */
  margin-top: 20px;
}

/* Nagłówki tabeli */
thead th {
  background-color: var(--color-background-mute); /* Jaśniejszy kolor nagłówka */
  color: var(--color-text-active); /* Kolor tekstu nagłówka */
  border: 1px solid var(--color-background-light); /* Ramki wokół nagłówków */
  padding: 10px;
  text-align: center;
}

/* Ramki dla komórek tabeli */
td, th {
  border: 1px solid var(--color-background-light); /* Jasnoszare ramki */
  padding: 10px; /* Dodaje odstęp wewnętrzny */
  text-align: center; /* Wyrównanie tekstu */
}

/* Naprzemienne kolory wierszy */
tbody tr:nth-child(odd) {
  background-color: #3f3f3f; /* Jasnoszary */
}

tbody tr:nth-child(even) {
  background-color: #333333; /* Ciemniejszy szary */
}

tr {
  text-align: center;
}

::v-deep(.achieved) {
  color: #6f986f;
}

::v-deep(.not-achieved) {
  color: #9a4242;
}


</style>
