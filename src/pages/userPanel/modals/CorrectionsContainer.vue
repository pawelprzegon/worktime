<script setup>
import {ref} from 'vue'
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

const alert = useAlertStore()
const dailyShifts = useDailyShiftsList();
const dt = getDateString(dailyShifts.date)

const props = defineProps({
  shift: Object,
})

const shiftTime = ref({
  start: props.shift.update.length > 0 ? getTimeString(getLastCorrectionUpdate(props.shift).start) : getTimeString(props.shift.start),
  stop: props.shift.update.length > 0 ? getTimeString(getLastCorrectionUpdate(props.shift).stop) : getTimeString(props.shift.stop)
})

const emit = defineEmits(['refreshCalendar'])
const anyCorrection = ref(props.shift.update?.length > 0)

const checkIsLast = (correction) => {
  const filtered = props.shift.update.filter(c => c.corrected === correction.corrected);
  const lastFiltered = filtered[filtered.length -1]
  return correction === lastFiltered
};

const saveCorrection = async () => {
  const shiftDt = {
      start: combineDateWithTime(dt, shiftTime.value.start),
      stop: combineDateWithTime(dt, shiftTime.value.stop),
    }
  const response = await shiftCorrection(props.shift.user_id, props.shift.id, shiftDt)
  emit('refreshCalendar')
  alert.show(response.status, response.message)
}

</script>

<template>
  <div class="grid grid-cols-2 m-3">

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
              :time="getTime(props.shift.start)"
              :text-color="anyCorrection ? 'red-500' : null"
            />
          </td>
          <td>
            <ShiftDetailContainer
              :time="getTime(props.shift.stop)"
              :text-color="anyCorrection ? 'red-500' : null"
            />
          </td>
        </tr>
        <tr v-for="(correction, index) in props.shift.update" :key="index">

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

    <div class="grid grid-flow-row justify-stretch align-middle h-fit">

      <form
          @submit.prevent="saveCorrection"
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

      <div class="place-items-center">

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