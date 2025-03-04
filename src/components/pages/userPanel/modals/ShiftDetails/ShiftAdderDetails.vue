<script setup>

import CustomTextButton from "@/components/CustomTextButton.vue";
import {checkShiftLessThan28800, combineDateWithTime} from "@/composables/utils.js";
import {setManualShift} from "@/composables/fetchers.js";
import {ref} from "vue";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {useDayStore} from "@/stores/calendarStore.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useRefreshStore} from "@/stores/refreshStore.js";


const monthStore = useSelectedMonthStore('calendar')
const dayStore = useDayStore();
const alert = useAlertStore();
const refreshStore = useRefreshStore()


const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  }
});

const shiftTime = ref({
    start: '',
    stop: ''
  });

  const note = ref('')

const submitShift = async () => {

    refreshStore.ON()
    const responseMessage = {
      status: '',
      message: ''
    }

    const shiftDt = {
      start: combineDateWithTime(dayStore.date, shiftTime.value.start),
      stop: combineDateWithTime(dayStore.date, shiftTime.value.stop),
    }

    if (!checkShiftLessThan28800(shiftDt)){
      await dayStore.saveToil(0, 0)
      responseMessage.status = 'warning'
      responseMessage.message = 'Shift time with Toil time is higher than 8h. Toil cleared!'
    }

    try {
      const response = await setManualShift(shiftDt, note.value)
      await monthStore.refresh()
      await dayStore.refresh()

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
    refreshStore.OFF()
    alert.show(responseMessage.status, responseMessage.message)
  }

</script>

<template>

  <div
    :class="[
    'transition-all duration-500 ease-in-out overflow-auto',
    props.isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
    ]"
  >

    <div
      class="
        grid gap-1 place-items-center m-1 p-1

        portrait-xs:grid-rows-2
        portrait-small:grid-rows-none portrait-small:grid-cols-2
        portrait-medium:grid-rows-none portrait-medium:grid-cols-2
      "
    >

      <form
          v-show="!monthStore.selected.closed"
          @submit.prevent.stop="submitShift"
          class="grid grid-flow-col gap-5 m-3"
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


      <CustomTextButton
          v-show="!monthStore.selected.closed"
          :label="'add'"
          @click="submitShift"
      />

    </div>

  </div>

</template>

<style scoped>

</style>