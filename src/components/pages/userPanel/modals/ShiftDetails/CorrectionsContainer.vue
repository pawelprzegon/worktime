<script setup>
import {ref, watch} from 'vue'
import {
  checkShiftLessThan28800,
  combineDateWithTime, formatTime,
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
import Default from "@vuepic/vue-datepicker";


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
  <div class="grid grid-cols-[40px_auto] my-5

              portrait-2xs:grid-cols-[24px_auto]
              portrait-xs:grid-cols-[28px_auto]
              portrait-small:grid-cols-[32px_auto]
              portrait-medium:grid-cols-[36px_auto]
              portrait-large:grid-cols-[40px_auto]
  "
  >

    <img
        src="@/assets/img/exchange.png"
        alt="location"
        class="filter-invert-100
              portrait-2xs:w-[16px]
              portrait-xs:w-[20px]
              portrait-small:w-[24px]
              portrait-medium:w-[28px]
              portrait-large:w-[32px]
              "

    />
    <div
      class="
      grid grid-cols-[40%_auto]

      portrait-2xs:grid-rows-2 portrait-2xs:grid-cols-none
      portrait-medium:grid-rows-none portrait-medium:grid-cols-[40%_auto]
      ">

      <div v-if="shift.update.length > 0" class="grid grid-flow-row">

        <div class="grid

        portrait-2xs:grid-cols-[30%_20%_20%]
        portrait-medium:grid-cols-[60px_auto_auto]
        ">

           <p class="text-sm m-auto">default</p>

           <ShiftDetailContainer
              :time="getTime(shift.start)"
              :text="Object({color: 'emerald-500', weight: ''})"
              :justify="'center'"
            />

            <ShiftDetailContainer
              :time="getTime(shift.stop)"
              :text="Object({color: 'red-500', weight: ''})"
              :justify="'center'"
            />

        </div>

        <div v-for="(correction, index) in shift.update" :key="index"
             class="grid

             portrait-2xs:grid-cols-[30%_20%_20%]
             portrait-medium:grid-cols-[60px_auto_auto]
             "
        >

          <p class="text-sm m-auto">{{index + 1}}</p>

           <ShiftDetailContainer
              :time="getTime(correction.start)"
              :text="Object({color: 'emerald-500', weight: ''})"
              :justify="'center'"
            />

            <ShiftDetailContainer
              :time="getTime(correction.stop)"
              :text="Object({color: 'red-500', weight: ''})"
              :justify="'center'"
            />

        </div>

      </div>


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