<script setup>
import {ref, watch} from 'vue'
import {
  checkShiftLessThan28800,
  combineDateWithTime,
  getDateString,
  getLastCorrectionUpdate,
  getTime,
  getTimeString
} from "@/composables/utils.js";
import ShiftDetailContainer from "@/components/pages/userPanel/ShiftDetailContainer.vue";
import '@/assets/modal.css'
import CustomTextButton from "@/components/CustomTextButton.vue";
import {useAlertStore} from "@/stores/alertStore.js";
import {usedayStore} from "@/stores/calendarStore.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {shiftCorrection} from "@/composables/fetchers.js";


const alert = useAlertStore()
const monthStore = useSelectedMonthStore('calendar')
const dayStore = usedayStore();
const dt = getDateString(dayStore.date)

const props = defineProps({
  shiftId: {
    type: String,
    required: true,
  }
})

const shift = dayStore.getShiftById(props.shiftId)

const shiftTime = ref({
  start: shift.value.update.length > 0 ? getTimeString(getLastCorrectionUpdate(shift.value).start) : getTimeString(shift.value.start),
  stop: shift.value.update.length > 0 ? getTimeString(getLastCorrectionUpdate(shift.value).stop) : getTimeString(shift.value.stop)
})

const anyCorrection = ref(shift.value.update?.length > 0)

const checkIsLast = (correction) => {
  const filtered = shift.value.update.filter(c => c.corrected === correction.corrected);
  const lastFiltered = filtered[filtered.length -1]
  return correction === lastFiltered
};

const saveCorrection = async () => {

    const responseMessage = {
      status: '',
      message: ''
    }

    const shiftDt = {
      start: combineDateWithTime(dt, shiftTime.value.start),
      stop: combineDateWithTime(dt, shiftTime.value.stop),
    }
    console.log(dayStore.toil.value)
    if (!checkShiftLessThan28800(shiftDt)){
      dayStore.toil.value = {}
      await dayStore.saveToil(0)
      responseMessage.status = 'warning'
      responseMessage.message = 'Shift time with Toil time is higher than 8h. Toil cleared!'
    }

    try {
      const response = await shiftCorrection(shift.value.user_id, shift.value.id, shiftDt)
      await monthStore.refresh()
      dayStore.refresh()

      if (responseMessage.status) {
        responseMessage.message += ` ${response.message}`
      } else {
        responseMessage.status = response.status
        responseMessage.message = response.message
      }
    } catch (error) {
      responseMessage.status = 'error'
      responseMessage.message = error.message
    }

    alert.show(responseMessage.status, responseMessage.message)

}


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
              :time="getTime(shift.start)"
              :text-color="anyCorrection ? 'red-500' : null"
            />
          </td>
          <td>
            <ShiftDetailContainer
              :time="getTime(shift.stop)"
              :text-color="anyCorrection ? 'red-500' : null"
            />
          </td>
        </tr>
        <tr v-for="(correction, index) in shift.update" :key="index">

          <td class="correction-index">
            {{`${index + 1}`}}
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
          v-show="!monthStore.selected.closed"
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
           v-show="!monthStore.selected.closed"
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