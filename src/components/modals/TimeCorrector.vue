<script setup>
import { ref } from 'vue'
import { getDate, getTime } from "@/utils.js";
import ShiftDetailContainer from "@/components/panel/ShiftDetailContainer.vue";
import DatePicker from "@/components/DatePicker.vue";

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
    required: true
  },
  defaultStart: {
    type: String,
    required: true
  },
  defaultStop: {
    type: String,
    required: true
  },
  corrections: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['newDateTime'])

const pickedStartStop = ref(null);

const select = (selectedToCorrect) => {
  pickedStartStop.value = selectedToCorrect;
}

const newDateTime = (selectedDateTime) => {
  emit('newDateTime', pickedStartStop.value, selectedDateTime)
}

const checkIsLast = (correction) => {
  const filtered = props.corrections.filter(c => c.corrected === correction.corrected);
  const lastFiltered = filtered[filtered.length -1]
  return correction === lastFiltered
};
</script>

<template>
  <div v-show="props.isActive" class="dropdown-content">

    <div>
      <h4 style="text-align: left">Correction history:</h4>

      <div class="defaults">

        <table class="corrections-table">
          <thead>
            <tr>
              <th>#</th>
              <th>start</th>
              <th>stop</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>default</td>
              <td>
                <ShiftDetailContainer
                  :date="getDate(props.defaultStart)"
                  :time="getTime(props.defaultStart)"
                  :class="['corrections-section', { 'shift-time-inactive': props.corrections.length > 0 }]"
                />
              </td>
              <td>
                <ShiftDetailContainer
                  :date="getDate(props.defaultStop)"
                  :time="getTime(props.defaultStop)"
                  :class="['corrections-section', { 'shift-time-inactive': props.corrections.length > 0 }]"
                />
              </td>
            </tr>
            <tr v-for="(correction, index) in props.corrections" :key="index">
              <td
                  class="correction-index"
              >
                {{`${index + 1} correction`}}
                <div class="tooltip-container">
                  {{getDate(correction.updated_at)}} {{getTime(correction.updated_at)}}
                </div>
              </td>
              <td>
                <ShiftDetailContainer
                  v-show="correction.corrected === 'start'"
                  :date="getDate(correction.date)"
                  :time="getTime(correction.date)"
                  :class="['corrections-section', { 'shift-time-inactive': !checkIsLast(correction)}]"
                />
              </td>
              <td>
                <ShiftDetailContainer
                  v-if="correction.corrected === 'stop'"
                  :date="getDate(correction.date)"
                  :time="getTime(correction.date)"
                  :class="['corrections-section', { 'shift-time-inactive': !checkIsLast(correction)}]"
                />
              </td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>

    <div>
      <section class="add-correction">
        <h4 style="text-align: left; font-size: 13px">Add new correction:</h4>
        <div class="picker-group">
          <p
            id="start"
            class="picker"
            @click="select('start')"
            :class="{ selected: pickedStartStop === 'start' }"
          >
            start time
          </p>
          <p
            id="stop"
            class="picker"
            @click="select('stop')"
            :class="{ selected: pickedStartStop === 'stop' }"
          >
            stop time
          </p>
        </div>
        <DatePicker
            @newDatetime="newDateTime"
        />
      </section>
    </div>

  </div>
</template>

<style scoped>

.corrections-table {
  width: 100%;
  border-collapse: collapse;
}

.corrections-table thead,
.corrections-table tbody{
  font-size: 10px;
}

.corrections-table th,
.corrections-table td {
  border: 1px solid #ccc;
}

.shift-time-inactive {
  text-decoration-line: line-through;
  text-decoration-color: #9a4242;
  text-decoration-thickness: 2px;
}

.collapse-enter-from,
.collapse-leave-to {
  height: 0;
  overflow: hidden;
}

.collapse-enter-to,
.collapse-leave-from {
  height: auto;
  overflow: hidden;
}

.dropdown-content {
  border: solid 1px var(--vt-c-black-light);
  padding: 10px;
  border-radius: 3px;
  background: var(--color-background-mute);
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 10px;
  background: var(--vt-c-black-light);
}

.corrections-section {
  font-size: 12px;
}

.defaults {
  justify-content: center;
  align-items: center;
  background: var(--vt-c-black-mute);
}

.picker-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;
}

.picker {
  border-radius: 3px;
  border: 1px solid white;
  margin: 2px;
  padding: 2px;
  font-size: 10px;
}

.selected {
  background: var(--vt-c-text-light);
  color: #0f0f0f;
}

.correction-index {
  position: relative;
}

.tooltip-container {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--vt-c-black-light);
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 1;
  transition: opacity 0.3s ease;
}

.correction-index:hover .tooltip-container {
  visibility: visible;
  opacity: 1;
}

</style>