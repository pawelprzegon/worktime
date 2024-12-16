<script setup>

import {formatTime} from "@/composables/utils.js";

defineProps({
  day: Object
})
</script>

<template>

  <div
    :class="['calendar-day',
        {
          'unfinished-shift': day.shifts.list.length > 0,
          'finished-shift': (day.shifts.regular + (day.shifts.overtimeTaken?.hours || 0) * 3600) >= 28800
        }]"
  >
    <span class="day-header">{{ day.date.getDate() }}</span>

    <div
        v-if="day.shifts.list.length > 0"
        class="shifts-list"
    >

      <small
          v-if="day.shifts.list.length > 0"
          class="shift"
          :class="{'has-corrections': day.shifts.overtimeTaken}"
      >
        {{ formatTime(day.shifts.regular) }}
      </small>

      <small
          v-if="day.shifts.list.length > 0 && day.shifts.overtime"
          class="shift overtime"
      >
        +{{ formatTime(day.shifts.overtime) }}
      </small>

      <small
          v-if="day.shifts.overtimeTaken"
          class="shift overtime"
      >
        -{{ formatTime(day.shifts.overtimeTaken.hours * 3600) }}
      </small>

    </div>
    <div
        v-else
        class="add-shift"
    >
      <img src="@/assets/img/add.png" alt="add-shift">
    </div>
  </div>

</template>

<style scoped>

.calendar-day {
  display: grid;
  grid-template-rows: 1fr 3fr;
  background-color: var(--vt-c-black-mute);
  border: 1px solid var(--vt-c-black-mute);
  padding: 6px;
  border-radius: 8px;
  width: 100px;
  height: 100px;
  transition: transform 0.2s ease;
  box-shadow: var(--vt-box-shadow)
}

.calendar-day:hover {
  cursor: pointer;
  transform: scale(1.02);
}

.day-header {
  display: block;
  border-bottom: 1px solid #595959;
}

.shifts-list {
  display: flex;
  flex-direction: column;
  justify-content: right;
  align-items: flex-end;
}

.has-corrections {
  position: relative;
}

.has-corrections::after {
  content: '';
  position: absolute;
  top: 1px;
  right: -3px;
  width: 6px;
  height: 6px;
  background-color: var(--color-text-overtime);
  border-radius: 50%;
}

.unfinished-shift {
  background: var(--vt-c-indigo);
}

.finished-shift {
  background: var(--finished-color);
}

.started-shift {
  color: var(--idle-color);
}

.shift {
  font-size: 15px;
  color:var(--color-text-active)
}

.overtime {
  color: var(--color-text-overtime);
}

.add-shift {
  display: block;
  margin: auto;
}

.add-shift img {
  filter: invert(30%);
}

.calendar-day:hover > .add-shift img {
  filter: invert(100%);
  transform: scale(1.02);
}

@media(max-width: 875px) {
  .has-corrections::after {
    width: 5px;
    height: 5px;
  }
  .calendar-day {
    width: 90px;
    height: 90px;
  }
}

@media(max-width: 800px) {

  .calendar-day {
    width: 80px;
    height: 80px;
    border-radius: 5px;
  }
}

@media(max-width: 750px) {
  .has-corrections::after {
    width: 4px;
    height: 4px;
  }
  .calendar-day {
    width: 75px;
    height: 75px;
    border-radius: 5px;
    padding: 4px;
  }
}

@media(max-width: 690px) {
  .shift {
    font-size: 13px;
  }
  .calendar-day {
    width: 70px;
    height: 70px;
    border-radius: 5px;
    padding: 4px;
  }
}

@media(max-width: 650px) {
  .shift,
  .day-header {
    font-size: 11px;
  }
  .calendar-day {
    width: 65px;
    height: 65px;
    border-radius: 3px;
    padding: 4px;
  }

  .add-shift img {
    width: 20px;
    height: 20px;
  }
}

@media(max-width: 620px) {
  .shift,
  .day-header {
    font-size: 11px;
  }
  .calendar-day {
    width: 60px;
    height: 60px;
    border-radius: 3px;
    padding: 3px;
  }

}

@media(max-width: 570px) {
  .shift,
  .day-header {
    font-size: 9px;
  }
  .calendar-day {
    width: 55px;
    height: 55px;
    border-radius: 3px;
    padding: 3px;
  }
}

@media(max-width: 520px) {
  .shift,
  .day-header {
    font-size: 7px;
  }
  .calendar-day {
    width: 50px;
    height: 50px;
    border-radius: 3px;
    padding: 2px;
  }
}

@media(max-width: 480px) {
  .shift,
  .day-header {
    font-size: 8px;
  }
  .calendar-day {
    width: 45px;
    height: 45px;
    border-radius: 2px;
    padding: 2px;
  }
  .add-shift img {
    width: 16px;
    height: 16px;
  }
}

@media(max-width: 430px) {
  .shift,
  .day-header {
    font-size: 7px;
  }
  .overtime {
    font-size: 6px;
  }
  .calendar-day {
    width: 40px;
    height: 40px;
    border-radius: 2px;
    padding: 2px;
  }
}


</style>