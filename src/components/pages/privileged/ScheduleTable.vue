<script setup>

import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import TableRow from "@/components/pages/privileged/TableRow.vue";

const monthStore = useSelectedMonthStore('privileged')

</script>

<template>

  <div class="px-2 mx-2">

    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Start time</th>
          <th>Stop time</th>
          <th>Regular Work time</th>
          <th>Over time</th>
          <th>Overtime taken</th>
          <th>Day off</th>
        </tr>
      </thead>
      <tbody>
        <TableRow
          v-for="(day, index) in monthStore.selected.days"
          :key="index"
          :day="day"
        />
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

@media (max-width: 1300px) {
  /* Nagłówki tabeli */
  thead th {
    padding: 2px;
  }

  /* Ramki dla komórek tabeli */
  td, th {
    padding: 2px;
  }
}

@media (max-width: 1000px) {
  table {
    width: 90%;
    font-size: 9px;
  }

  /* Nagłówki tabeli */
  thead th {
    padding: 2px;
  }

  /* Ramki dla komórek tabeli */
  td, th {
    padding: 2px;
  }
}


@media (max-width: 800px) {
  table {
    width: 90%;
    font-size: 8px;
  }

  /* Nagłówki tabeli */
  thead th {
    padding: 2px;
  }

  /* Ramki dla komórek tabeli */
  td, th {
    padding: 2px;
  }
}


</style>