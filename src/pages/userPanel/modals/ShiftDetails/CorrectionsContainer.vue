<script setup>
import {ref, watch} from 'vue'
import {
  combineDateWithTime, getDateString,
  getLastCorrectionUpdate,
  getTime,
  getTimeString
} from "@/composables/utils.js";
import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";
import '@/assets/modal.css'
import CustomTextButton from "@/components/CustomTextButton.vue";
import {shiftCorrection} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useDailyShiftsList} from "@/stores/calendarStore.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";


const alert = useAlertStore()
const monthStore = useSelectedMonthStore('calendar')
const dailyShifts = useDailyShiftsList();
const dt = getDateString(dailyShifts.date)

const props = defineProps({
  shift: Object,
})

const selectedDayShifts = ref(props.shift)

console.log(selectedDayShifts.value)

const shiftTime = ref({
  start: selectedDayShifts.value.update.length > 0 ? getTimeString(getLastCorrectionUpdate(selectedDayShifts.value).start) : getTimeString(selectedDayShifts.value.start),
  stop: selectedDayShifts.value.update.length > 0 ? getTimeString(getLastCorrectionUpdate(selectedDayShifts.value).stop) : getTimeString(selectedDayShifts.value.stop)
})

const anyCorrection = ref(props.shift.update?.length > 0)

const checkIsLast = (correction) => {
  const filtered = selectedDayShifts.value.update.filter(c => c.corrected === correction.corrected);
  const lastFiltered = filtered[filtered.length -1]
  return correction === lastFiltered
};

const saveCorrection = async () => {
  const shiftDt = {
      start: combineDateWithTime(dt, shiftTime.value.start),
      stop: combineDateWithTime(dt, shiftTime.value.stop),
    }
  const response = await shiftCorrection(selectedDayShifts.value.user_id, selectedDayShifts.value.id, shiftDt)

  if (response.status === 'success') {
    alert.show(response.status, response.message)
    await monthStore.refresh()
    dailyShifts.updateDay()
    selectedDayShifts.value = dailyShifts.getShift(selectedDayShifts.value.id)
  } else {
    alert.show(response.status, response.message)
  }
}

watch(() => props.shift, (newShift, oldShift) => {
  console.log(selectedDayShifts.value)

}, { deep: true });

</script>

<template>
  <div
      class="
      grid grid-cols-2

      portrait-2xs:grid-rows-2 portrait-2xs:grid-cols-none
      portrait-medium:grid-rows-none portrait-medium:grid-cols-2
      ">

    <table class="corrections-table m-3">
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
              :time="getTime(selectedDayShifts.start)"
              :text-color="anyCorrection ? 'red-500' : null"
            />
          </td>
          <td>
            <ShiftDetailContainer
              :time="getTime(selectedDayShifts.stop)"
              :text-color="anyCorrection ? 'red-500' : null"
            />
          </td>
        </tr>
        <tr v-for="(correction, index) in selectedDayShifts.update" :key="index">

          <td class="correction-index">
            {{`${index + 1} correction`}}
          </td>
          <td>
            <ShiftDetailContainer
              :time="getTime(correction.start)"
              :text-color="!checkIsLast(correction) ? 'red-500' : null"
            />
          </td>
          <td>
            <ShiftDetailContainer
              :time="getTime(correction.stop)"
              :text-color="!checkIsLast(correction) ? 'red-500' : null"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div class="grid grid-flow-row justify-stretch align-middle h-full">

      <form
          @submit.prevent.stop="saveCorrection"
          class="grid grid-flow-col w-full mb-3"
      >
        <div class="grid grid-flow-row justify-center items-center">
          <label for="startTime" class="text-medium font-medium text-gray-400">Start hour</label>
          <input
            v-model="shiftTime.start"
            type="time"
            id="startTime"
            class="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm text-lg"
            required
          />
        </div>

        <div class="grid grid-flow-row justify-center items-center">
          <label for="endTime" class="text-medium font-medium text-gray-400">Stop hour</label>
          <input
            v-model="shiftTime.stop"
            type="time"
            id="endTime"
            class="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm text-lg"
            required
          />
        </div>
      </form>

      <div class="place-items-end place-content-end">

         <CustomTextButton
          :label="'add'"
          @click="saveCorrection"
        />

      </div>


    </div>
  </div>

</template>

<style scoped>


.corrections-table {
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

</style>