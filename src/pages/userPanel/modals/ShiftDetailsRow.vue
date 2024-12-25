<script setup>

import {formatTime, getLastCorrectionUpdate, getTime} from "@/composables/utils.js";
import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";
import DetailsDropdown from "@/pages/userPanel/modals/DetailsDropdown.vue";
import ShiftDetails from "@/pages/userPanel/modals/ShiftDetails.vue";
import {ref} from "vue";
import CustomIconButton from "@/components/CustomIconButton.vue";
import {useCalendarSelectedDay} from "@/stores/calendarStore.js";
import {useAlertStore} from "@/stores/alertStore.js";

const selectedDay = useCalendarSelectedDay();
const alert = useAlertStore()

const props = defineProps({
  shiftId: {
    type: String,
    required: true
  },
  index: String
})

const shift = selectedDay.getShift(props.shiftId)

console.log(props.shiftId)

const isOpen = ref(false)

const toggleDropdown = (buttonStatus) => {
  isOpen.value = buttonStatus
}

const handleDeleteShift = async () => {
  const response = await selectedDay.removeShift(shift.id)
  alert.show(response.status, response.message)
}

const start = shift.update.length > 0 ? getLastCorrectionUpdate(shift).start : shift.start
const stop = shift.update.length > 0 ? getLastCorrectionUpdate(shift).stop : shift.stop

</script>

<template>

  <div
      class="flex flex-col items-center m-3
      border rounded-lg"
      :class="isOpen ? 'border-silver' : 'border-third'"
  >

    <div
        class="w-full flex flex-row justify-between"
        :class="!isOpen ? 'hover:bg-secondary' : 'hover:bg-none'"
    >

      <DetailsDropdown
          @open="toggleDropdown"
      >
        <div
          class="flex flex-row justify-around items-center">

          <p class="text-2xl m-2">{{props.index}}</p>

          <ShiftDetailContainer
            :label="'start'"
            :time="getTime(start)"
            :orient="'row'"
          />

          <ShiftDetailContainer
            :label="'stop'"
            :time="getTime(stop)"
            :orient="'row'"
          />

          <ShiftDetailContainer
            :label="'work'"
            :time="formatTime(shift.work)"
            :orient="'row'"
            :text-color="'overtime'"
          />

        </div>

      </DetailsDropdown>

      <CustomIconButton
          icon="delete.png"
          @click="handleDeleteShift"
      />

    </div>

    <ShiftDetails
        :shift="shift"
        :is-open="isOpen"
    />

  </div>


</template>

<style scoped>

</style>