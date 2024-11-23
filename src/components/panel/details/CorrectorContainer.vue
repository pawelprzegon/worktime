<script setup>
import {inject, ref, watch} from 'vue'
import { getDate, getTime } from "@/utils.js";
import ShiftDetailContainer from "@/components/panel/details/ShiftDetailContainer.vue";
import DatePicker from "@/components/DatePicker.vue";
import '@/assets/modal.css'
import CustomTextButton from "@/components/utils/CustomTextButton.vue";
import {shiftCorrection} from "@/fetchers.js";
import Alert from "@/components/utils/Alert.vue";

const props = defineProps({
  shift: Object,
})

const emit = defineEmits(['newDateTime', 'refreshModal'])
const alert = inject('alert');
const pickedStartStop = ref(null);
const datePickerKey = ref(0)
const selectedNewDateTime = ref('')

const select = (selectedToCorrect) => {
  pickedStartStop.value = selectedToCorrect;
}

const newDateTime = (selectedDateTime) => {
  selectedNewDateTime.value = selectedDateTime
}

const checkIsLast = (correction) => {
  const filtered = props.shift.time_correction.filter(c => c.corrected === correction.corrected);
  const lastFiltered = filtered[filtered.length -1]
  return correction === lastFiltered
};

const checkIsAny = (corrected) => {
  const filtered = props.shift.time_correction.filter(c => c.corrected === corrected);
  return filtered.length > 0;
}

const saveCorrection = async () => {
  const response = await shiftCorrection(props.shift.user_id, props.shift.id, selectedNewDateTime.value, pickedStartStop.value)
  alert.show(response.status, response.message)
  emit('refreshModal')
}

</script>

<template>
  <div class="corrector-container">

    <section>
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
                  :date="getDate(props.shift.start)"
                  :time="getTime(props.shift.start)"
                  :class="['corrections-section',
                  { 'shift-time-inactive': props.shift.time_correction.length > 0 && checkIsAny('start') }]"
                />
              </td>
              <td>
                <ShiftDetailContainer
                  :date="getDate(props.shift.stop)"
                  :time="getTime(props.shift.stop)"
                  :class="['corrections-section',
                  { 'shift-time-inactive': props.shift.time_correction.length > 0 && checkIsAny('stop')}]"
                />
              </td>
            </tr>
            <tr v-for="(correction, index) in props.shift.time_correction" :key="index">

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
                  v-if="correction.corrected === 'start'"
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

    </section>

    <section class="calendar-section">
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
          :key="datePickerKey"
        />
      </section>

      <section class="shift-details-header" id="correct">
        <CustomTextButton
          :label="'save'"
          :width="80"
          :padding="2"
          :margin="2"
          @click="saveCorrection"
        />

      </section>
    </section>

  </div>
</template>

<style scoped>

.corrector-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 10px;
  padding: 10px;
  border-radius: 3px;
  background: var(--vt-c-black-light);
  height: 200px;
}

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

.picker:hover {
  cursor: pointer;
  background: var(--vt-c-text-light);
  color: #0f0f0f;
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

.calendar-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

@media (max-width: 600px) {
  .corrector-container {
    grid-template-columns: none;
    grid-template-rows: 1fr 1fr;
    height: fit-content;
  }

}

</style>