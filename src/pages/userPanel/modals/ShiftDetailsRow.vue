<script setup>

import {formatTime, getLastCorrectionUpdate, getTime} from "@/composables/utils.js";
import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";
import DetailsDropdown from "@/pages/userPanel/modals/DetailsDropdown.vue";
import ShiftDetails from "@/pages/userPanel/modals/ShiftDetails.vue";
import {ref, defineEmits} from "vue";
import CustomIconButton from "@/components/CustomIconButton.vue";
import {useDailyShiftsList} from "@/stores/calendarStore.js";
import {useAlertStore} from "@/stores/alertStore.js";

const dailyShifts = useDailyShiftsList();
const alert = useAlertStore()

const emit = defineEmits(['refreshCalendar'])

const props = defineProps({
  shiftId: {
    type: String,
    required: true
  },
  index: Number
})

const shift = dailyShifts.getShift(props.shiftId)


const isOpen = ref(false)
const toggleDropdown = (buttonStatus) => {
  isOpen.value = buttonStatus

}
const handleDeleteShift = async () => {
  const response = await dailyShifts.removeShift(shift.id)
  alert.show(response.status, response.message)
  emitRefreshCalendar()

}
const start = shift.update.length > 0 ? getLastCorrectionUpdate(shift).start : shift.start
const stop = shift.update.length > 0 ? getLastCorrectionUpdate(shift).stop : shift.stop

const emitRefreshCalendar = () => {
  emit("refreshCalendar");
};


</script>

<template>

  <div
      class="flex flex-col items-center m-3
      border rounded-lg"
      :class="isOpen ? 'border-silver bg-secondary' : 'border-third'"
  >

    <div
        class="w-full flex flex-row justify-between"
        :class="!isOpen ? 'hover:bg-secondary' : 'hover:bg-none'"
    >

      <DetailsDropdown
          @open="toggleDropdown"
      >
        <div class="flex flex-row justify-around items-center">
          <p class="text-2xl m-2 text-beb font-bold p-1">{{props.index}}</p>

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
            :label="'shift time'"
            :time="formatTime(shift.work)"
            :orient="'row'"
          />

        </div>

      </DetailsDropdown>

      <div class="place-items-end my-auto">
        <CustomIconButton
          icon="delete.png"
          @click="handleDeleteShift"
        />
      </div>


    </div>

    <ShiftDetails
        :shift="shift"
        :is-open="isOpen"
        @refresh-calendar="emitRefreshCalendar"
    />

  </div>


</template>

<style scoped>

</style>