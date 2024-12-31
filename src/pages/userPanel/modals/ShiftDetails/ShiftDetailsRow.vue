<script setup>

import {formatTime, getLastCorrectionUpdate, getTime, updateScreenSize} from "@/composables/utils.js";
import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";
import DetailsDropdown from "@/pages/userPanel/modals/ShiftDetails/DetailsDropdown.vue";
import ShiftDetails from "@/pages/userPanel/modals/ShiftDetails/ShiftDetails.vue";
import {ref, defineEmits, onMounted} from "vue";
import CustomIconButton from "@/components/CustomIconButton.vue";
import {useDailyShiftsList} from "@/stores/calendarStore.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useScreenSizeStore} from "@/stores/utilsStore.js";

const dailyShifts = useDailyShiftsList();
const alert = useAlertStore()
const screenSize = useScreenSizeStore()

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
}

const start = shift.update.length > 0 ? getLastCorrectionUpdate(shift).start : shift.start
const stop = shift.update.length > 0 ? getLastCorrectionUpdate(shift).stop : shift.stop

onMounted(async () => {
  updateScreenSize(screenSize);
});

</script>

<template>

  <div
      class="inline-grid items-center m-3
      border rounded-lg
      overflow-auto
      "
      :class="isOpen ? 'border-silver bg-secondary' : 'border-third'"
  >

    <div
        class="grid grid-cols-[1fr_auto] items-center gap-4"
        :class="!isOpen ? 'hover:bg-secondary' : 'hover:bg-none'"
    >

      <DetailsDropdown
          @open="toggleDropdown"
      >
        <div class="
        flex flex-row justify-around items-center
        ">

          <p
              class="
              text-2xl m-2 text-beb font-bold p-1

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