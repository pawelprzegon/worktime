<script setup>
import {inject, ref} from 'vue'
import {
  combineDateWithTime,
  getLastCorrectionUpdate,
  getTime,
  getTimeString
} from "@/composables/utils.js";
import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";
import '@/assets/modal.css'
import CustomTextButton from "@/components/CustomTextButton.vue";
import {shiftCorrection} from "@/composables/fetchers.js";
import Alert from "@/components/Alert.vue";

const props = defineProps({
  shift: Object,
  date: Date
})

const shiftTime = ref({
  start: props.shift.update.length > 0 ? getTimeString(getLastCorrectionUpdate(props.shift).start) : getTimeString(props.shift.start),
  stop: props.shift.update.length > 0 ? getTimeString(getLastCorrectionUpdate(props.shift).stop) : getTimeString(props.shift.stop)
})

const shiftTimeCorrection = ref({
  start: '',
  stop: ''
});

const emit = defineEmits(['newDateTime', 'refreshModal'])
const alert = inject('alert');
const anyCorrection = ref(props.shift.update?.length > 0)

const checkIsLast = (correction) => {
  const filtered = props.shift.update.filter(c => c.corrected === correction.corrected);
  const lastFiltered = filtered[filtered.length -1]
  return correction === lastFiltered
};

const saveCorrection = async () => {
  const shiftDt = {
      start: combineDateWithTime(props.date, shiftTimeCorrection.value.start),
      stop: combineDateWithTime(props.date, shiftTimeCorrection.value.stop),
    }
  const response = await shiftCorrection(props.shift.user_id, props.shift.id, shiftDt)
  alert.show(response.status, response.message)
  emit('refreshModal')
}

</script>

<template>
  <div class="corrector-container">
    <Alert/>
    <section>
      <h4 style="text-align: left">Correction history:</h4>
      <div class="defaults">

        <table
            v-if="anyCorrection"
            class="corrections-table">
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
                  :time="getTime(props.shift.start)"
                  :class="['corrections-section',
                  { 'shift-time-inactive': anyCorrection }]"
                />
              </td>
              <td>
                <ShiftDetailContainer
                  :time="getTime(props.shift.stop)"
                  :class="['corrections-section',
                  { 'shift-time-inactive': anyCorrection}]"
                />
              </td>
            </tr>
            <tr v-for="(correction, index) in props.shift.update" :key="index">

              <td
                  class="correction-index"
              >
                {{`${index + 1} correction`}}
              </td>
              <td>
                <ShiftDetailContainer
                  :time="getTime(correction.start)"
                  :class="['corrections-section', { 'shift-time-inactive': !checkIsLast(correction)}]"
                />
              </td>
              <td>
                <ShiftDetailContainer
                  :time="getTime(correction.stop)"
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
        <form @submit.prevent="saveCorrection">
          <div class="mb-4">
            <label for="startTime" class="block text-medium font-medium text-gray-400">Start hour</label>
            <input
              v-model="shiftTime.start"
              type="time"
              id="startTime"
              class="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              required
            />
          </div>

          <div class="mb-4">
            <label for="endTime" class="block text-medium font-medium text-gray-400">Stop hour</label>
            <input
              v-model="shiftTime.stop"
              type="time"
              id="endTime"
              class="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              required
            />
          </div>
        </form>
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