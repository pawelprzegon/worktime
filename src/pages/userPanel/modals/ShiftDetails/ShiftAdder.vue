<script setup>
  import { ref } from 'vue';
  import {
    checkShiftLessThan28800,
    combineDateWithTime,
  } from "@/composables/utils.js";
  import {setManualShift} from "@/composables/fetchers.js";
  import {usedayStore} from "@/stores/calendarStore.js";
  import {useSelectedMonthStore} from "@/stores/utilsStore.js";
  import {useAlertStore} from "@/stores/alertStore.js";
  import CustomTextButton from "@/components/CustomTextButton.vue";
  import {useRefreshStore} from "@/stores/refreshStore.js";

  const monthStore = useSelectedMonthStore('calendar')
  const dayStore = usedayStore();
  const alert = useAlertStore();
  const refreshStore = useRefreshStore()

  const props = defineProps({
    closeModal: Function,
  })

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
      class="inline-grid items-center m-3
      border-2 rounded-lg border-silver
      overflow-auto
      w-[95%]
      "
  >

      <div
          class="grid grid-cols-[1fr_auto] items-center bg-secondary"
      >
        <div class="shadow-2xl text-white flex justify-center items-center box-border rounded-md p-3">

        <div class="p-2 w-fit">

          <div class="grid grid-flow-row">

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

            <div class="place-items-center">

               <CustomTextButton
                  v-show="!monthStore.selected.closed"
                  :label="'add'"
                  @click="submitShift"
              />

          </div>


          </div>

        </div>
      </div>

      </div>

    </div>

</template>



<style scoped>
</style>