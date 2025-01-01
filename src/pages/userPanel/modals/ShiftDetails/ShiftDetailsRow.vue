<script setup>

import {formatTime, getLastCorrectionUpdate, getTime, updateScreenSize} from "@/composables/utils.js";
import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";
import DetailsDropdown from "@/pages/userPanel/modals/ShiftDetails/DetailsDropdown.vue";
import ShiftDetails from "@/pages/userPanel/modals/ShiftDetails/ShiftDetails.vue";
import {ref, onMounted} from "vue";
import CustomIconButton from "@/components/CustomIconButton.vue";
import {useDailyShiftsList} from "@/stores/calendarStore.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useScreenSizeStore, useSelectedMonthStore} from "@/stores/utilsStore.js";

const dailyShifts = useDailyShiftsList();
const monthStore = useSelectedMonthStore('calendar')
const alert = useAlertStore()
const screenSize = useScreenSizeStore()

const props = defineProps({
  shiftId: {
    type: String,
    required: true
  },
  index: Number,
  closeModal: Function
})

const shift = ref(dailyShifts.getShift(props.shiftId))


const isOpen = ref(false)
const toggleDropdown = (buttonStatus) => {
  isOpen.value = buttonStatus

}
const handleDeleteShift = async () => {
  console.log(props.shiftId)
  const response = await dailyShifts.removeShift(props.shiftId)
  alert.show(response.status, response.message)
  await monthStore.refresh()
  if (dailyShifts.selectedDay.shiftsList.length <= 0){
    props.closeModal()
  }
}

const start = shift.value.update.length > 0 ? getLastCorrectionUpdate(shift.value).start : shift.value.start
const stop = shift.value.update.length > 0 ? getLastCorrectionUpdate(shift.value).stop : shift.value.stop

onMounted(async () => {
  updateScreenSize(screenSize);
});

</script>

<template>

  <div
      class="inline-grid items-center m-3
      border rounded-lg
      overflow-auto
      w-[95%]
      "
      :class="isOpen ? 'border-silver bg-secondary' : 'border-third'"
  >

    <div
        class="grid grid-cols-[1fr_auto] items-center gap-4 w-full"
        :class="!isOpen ? 'hover:bg-secondary' : 'hover:bg-none'"
    >

      <DetailsDropdown
          @open="toggleDropdown"
      >
        <div class="flex flex-grow justify-between items-center w-full">

          <p
              class="
              text-2xl m-2 text-beb font-bold p-1 w-[30px]

              portrait-2xs:m-0 portrait-2xs:p-0
              portrait-medium:m-1 portrait-medium:p-1
              "
          >{{props.index}}</p>

          <div
              class="
              flex

              portrait-2xs:text-xs portrait-2xs:flex-cols
              portrait-medium:text-base portrait-medium:flex-row
              "
          >
            <ShiftDetailContainer
              :label="'start'"
              :time="getTime(start)"
              :orient="!screenSize.isPortraitSmall ? 'row' : 'col'"
            />

            <ShiftDetailContainer
              :label="'stop'"
              :time="getTime(stop)"
              :orient="!screenSize.isPortraitSmall ? 'row' : 'col'"
            />

            <ShiftDetailContainer
              :label="'shift time'"
              :time="formatTime(shift.work)"
              :orient="!screenSize.isPortraitSmall ? 'row' : 'col'"
            />
          </div>

          <CustomIconButton
            icon="delete.png"
            @click="handleDeleteShift"
          />

        </div>

      </DetailsDropdown>

    </div>

    <ShiftDetails
        :shift="shift"
        :is-open="isOpen"
    />

  </div>


</template>

<style scoped>

</style>