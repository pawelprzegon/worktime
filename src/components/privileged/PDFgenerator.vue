<script setup>
import jsPDF from "jspdf";
import "jspdf-autotable";
import {ref} from "vue";
import {add, eachDayOfInterval, endOfMonth, format, startOfMonth, sub} from "date-fns";
import {getOvertime, getUserShifts} from "@/fetchers.js";
import {formatTime, getLastStartStop, range, getTime} from "@/utils.js";
import CustomNaviButton from "@/components/utils/CustomNaviButton.vue";

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const currentMonth = ref(new Date());
const calculatedWorkTime = ref(0)
const calculatedOvertimeTime = ref(0)
const startDay = ref(null);
const daysBeforeRange = ref(null);
const endDay = ref(null);
const daysAfterRange = ref(null);

const daysInMonth = ref(
  eachDayOfInterval({
    start: startOfMonth(currentMonth.value),
    end: endOfMonth(currentMonth.value),
  }).map(date => ({
    date,
    hours: 0,
    note: '',
    shifts: { list: [], summary: 0 }
  }))
);


const updateDaysInMonth = () => {
  daysInMonth.value = eachDayOfInterval({
    start: startOfMonth(currentMonth.value),
    end: endOfMonth(currentMonth.value),
  }).map(date => ({
    date,
    hours: 0,
    note: '',
    shifts: { list: [], summary: 0 }
  }));
};

const prevMonth = () => {
  currentMonth.value = sub(currentMonth.value, { months: 1 });
  updateDaysInMonth();
  getDates()
};

const nextMonth = () => {
  currentMonth.value = add(currentMonth.value, { months: 1 });
  updateDaysInMonth();
  getDates()

};

const getDates = async () => {
  calculatedWorkTime.value = 0;
  calculatedOvertimeTime.value = 0;

  try {
    const shifts = await getUserShifts(currentMonth.value, props.user._id);
    const overtimes = await getOvertime(currentMonth.value);
    startDay.value = new Date(daysInMonth.value[0]['date']).getDay() || 7;
    endDay.value = new Date(daysInMonth.value[daysInMonth.value.length - 1]['date']).getDay() || 7;
    daysBeforeRange.value = range(2, startDay.value);
    daysAfterRange.value = range(endDay.value, 6);

    const getDate = (dateTimeStr) => dateTimeStr.split('T')[0];

    const splitOverTime = (shiftTime) => {
      if (shiftTime <= 28800) {
        return {'work': shiftTime, 'overtime': 0};
      } else {
        return {'work': 28800, 'overtime': shiftTime - 28800};
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

getDates()


// Funkcja generująca PDF
const generatePDF = () => {
  const doc = new jsPDF();
  doc.text(`Harmonogram czasu pracy - ${format(currentMonth.value, 'MMMM yyyy')}`, 10, 10);

  // Przygotowanie danych do tabeli
  const tableBody = daysInMonth.value.map(day => [
    format(day.date, 'yyyy-MM-dd'),
    day.shifts.list.length > 0 ? day.shifts.list[0].start || '-' : '-',
    day.shifts.list.length > 0 ? day.shifts.list[0].end || '-' : '-',
    formatTime(day.shifts.regular || 0),
  ]);

  // Dodanie tabeli do PDF
  doc.autoTable({
    head: [["Data", "Start time", "Stop time", "Work time"]],
    body: tableBody,
  });

  doc.save("harmonogram-czasu-pracy.pdf");
};

const getLast = (day) => {
  let shifts = []
  day.shifts.list.forEach(shift => {
    let obj = {
      startTime: Number,
      stopTime: Number,
    }
    obj.startTime = getTime(getLastStartStop(shift, 'start'))
    obj.stopTime = getTime(getLastStartStop(shift, 'stop'))
    shifts.push(obj)
  })
  return shifts
}


const calculateTime = (day) => {

  const formattedDate = format(day.date, 'yyyy-MM-dd');
  const overtimeHours = day.shifts.overtimeTaken?.hours || 0
  const workTime = day.shifts.list.length > 0 ? formatTime(day.shifts.regular + overtimeHours * 3600 || 0) : '-'
  let result = `<td>${formattedDate}</td>`
  let start = ``
  let stop = ``
  const dayData = getLast(day)

  dayData.forEach(shift => {

    const startTime = day.shifts.list.length > 0
      ? shift.startTime : '-';

    const stopTime = day.shifts.list.length > 0
      ? shift.stopTime : '-';

    start += `<p>${startTime}</p>`
    stop += `<p>${stopTime}</p>`

  })

  start = start ? start : '-'
  stop = stop ? stop : '-'

  result += `
    <td class="multiple-data">${start}</td>
    <td class="multiple-data">${stop}</td>
  `
  result += `<td>${workTime}</td>`
  return result;
};

</script>

<template>
  <div v-if="props.user">
    <button @click="generatePDF">Pobierz harmonogram</button>

    <h1>{{props.user.first_name}} {{props.user.last_name}}</h1>

    <div class="calendar-navigation">
      <CustomNaviButton direction="preview" size="20" @click="prevMonth"/>
      <span class="nav-label">{{ format(currentMonth, 'MMMM yyyy') }}</span>
      <CustomNaviButton direction="next" size="20" @click="nextMonth"/>
    </div>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Start time</th>
          <th>Stop time</th>
          <th>Work time</th>
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
  width: 70%;
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


</style>
