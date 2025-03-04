<script setup>

import CustomTextButton from "@/components/CustomTextButton.vue";
import {
  checkShiftLessThan28800,
  combineDateWithTime, getDateString,
  getLastCorrectionUpdate,
  getTimeString
} from "@/composables/utils.js";
import {shiftCorrection} from "@/composables/fetchers.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {ref, watch} from "vue";
import {useDayStore} from "@/stores/calendarStore.js";
import {useAlertStore} from "@/stores/alertStore.js";

const alert = useAlertStore()
const dayStore = useDayStore();
const monthStore = useSelectedMonthStore('calendar')
const dt = getDateString(dayStore.date)

const props = defineProps({
  shiftId: {
    type: String,
    required: true,
  }
})

const shift = ref(null);

watch(() => props.shiftId, (newShiftId) => {
  shift.value = dayStore.getShiftById(newShiftId).value;
}, { immediate: true });

// Define shift time based on shift value
const shiftTime = ref({
  start: shift.value?.update?.length > 0 ? getTimeString(getLastCorrectionUpdate(shift.value).start) : getTimeString(shift.value.start),
  stop: shift.value?.update?.length > 0 ? getTimeString(getLastCorrectionUpdate(shift.value).stop) : getTimeString(shift.value.stop),
});

// Recalculate shiftTime when shift changes
watch(shift, (newShift) => {
  shiftTime.value = {
    start: newShift?.update?.length > 0 ? getTimeString(getLastCorrectionUpdate(newShift).start) : getTimeString(newShift.start),
    stop: newShift?.update?.length > 0 ? getTimeString(getLastCorrectionUpdate(newShift).stop) : getTimeString(newShift.stop),
  };
});

const saveCorrection = async () => {

    const responseMessage = {
      status: '',
      message: ''
    }

    const shiftDt = {
      start: combineDateWithTime(dt, shiftTime.value.start),
      stop: combineDateWithTime(dt, shiftTime.value.stop),
    }

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
  <p>{{props.shiftId}}</p>
  <form
          v-show="!monthStore.selected.closed"
          @submit.prevent.stop="saveCorrection"
          class="grid grid-flow-col m-1"
      >
        <div class="grid grid-flow-row justify-center items-center">
          <label for="startTime" class="text-xs font-normal text-gray-400">Start hour</label>
          <input
            v-model="shiftTime.start"
            type="time"
            id="startTime"
            class="block w-full border text-black border-gray-300 rounded-md shadow-sm text-base m-1"
            required
          />
        </div>

        <div class="grid grid-flow-row justify-center items-center">
          <label for="endTime" class="text-xs font-normal text-gray-400">Stop hour</label>
          <input
            v-model="shiftTime.stop"
            type="time"
            id="endTime"
            class="block w-full border text-black border-gray-300 rounded-md shadow-sm text-base m-1"
            required
          />
        </div>
        <div class="place-items-end place-content-end">
         <CustomTextButton
           v-show="!monthStore.selected.closed"
          :label="'correct'"
          @click="saveCorrection"
        />
      </div>
      </form>

</template>

<style scoped>

</style>