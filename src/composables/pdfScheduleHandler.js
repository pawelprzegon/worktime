import {monthMapper, transposeTable} from "@/composables/privilegedHandler.js";
import {format} from "date-fns";
import jsPDF from "jspdf";
import robotoFont from "@/assets/font/Roboto-Light-normal.js";
import {formatTime, getLast} from "@/utils.js";
import {prepareStartAndStopTimePDF} from "@/composables/pdfHandler.js";
import {daysOff, leaveTypes, other} from "@/data/privileged_data.js";


const baseShiftTime = 28800
const baseShiftDelta = 900


export const generatePDF = (selectedUser, selectedMonth) => {
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
  doc.text(`${selectedUser.user.first_name} ${selectedUser.user.last_name}`, 10, 20);

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
  const tableBody = selectedMonth.daysInMonth.map(day => {

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
  doc.save(`${selectedUser.user.first_name}_${selectedUser.user.last_name}-${monthYear}.pdf`);
};