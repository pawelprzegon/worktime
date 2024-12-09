<script setup>

import {calculateTime, daysInMonth} from "@/composables/privilegedHandler.js";
</script>

<template>

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