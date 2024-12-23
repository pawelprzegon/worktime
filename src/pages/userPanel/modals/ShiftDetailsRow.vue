<script setup>

import {formatTime, getLastCorrectionUpdate, getTime} from "@/composables/utils.js";
import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";
import DetailsDropdown from "@/pages/userPanel/modals/DetailsDropdown.vue";
import ShiftDetails from "@/pages/userPanel/modals/ShiftDetails.vue";

const props = defineProps({
  shift: {
    type: Object,
    required: true
  },
  overtime: Object,
  calculatedOvertime: {
    type: Number,
    default: 0
  },
  selectedDay: Date,
  closeModal: Function,
  index: Number
})

const start = props.shift.update.length > 0 ? getLastCorrectionUpdate(props.shift).start : props.shift.start
const stop = props.shift.update.length > 0 ? getLastCorrectionUpdate(props.shift).stop : props.shift.stop

</script>

<template>

  <div
      class="flex flex-col items-center
      border border-silver rounded-lg">

    <div class="w-full flex flex-row justify-between">

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

      <img
        class="
        w-10 h-10 m-1 grayscale
        hover:grayscale-0 hover:cursor-pointer"
        src="../../../assets/img/delete.png"
        alt="delete"
      >

    </div>

    <DetailsDropdown>
      <ShiftDetails
          :shift="shift"
      />
  </DetailsDropdown>

  </div>


</template>

<style scoped>

</style>