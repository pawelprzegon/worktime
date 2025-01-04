<script setup>
  import { ref } from 'vue';
  import ModalWrapper from "@/components/ModalWrapper.vue";
  import {combineDateWithTime, formatTime, getDateString} from "@/composables/utils.js";
  import {setManualShift} from "@/composables/fetchers.js";
  import {useDailyShiftsList} from "@/stores/calendarStore.js";
  import {useSelectedMonthStore} from "@/stores/utilsStore.js";
  import {useAlertStore} from "@/stores/alertStore.js";
  import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";
  import OvertimeContainer from "@/pages/userPanel/modals/ShiftDetails/OvertimeContainer.vue";
  import NoteContainer from "@/pages/userPanel/modals/ShiftDetails/NoteContainer.vue";

  const monthStore = useSelectedMonthStore('calendar')
  const dailyShifts = useDailyShiftsList();
  const alert = useAlertStore()

  const isModalOpen = ref(true);
  const shiftTime = ref({
    start: '',
    stop: ''
  });

  const note = ref('')

  const props = defineProps({
    closeModal: Function,
  })

  const dt = getDateString(dailyShifts.date)

  const closeModal = () => {
    props.closeModal();
    isModalOpen.value = false;
  }

  const submitShift = async () => {
    const shiftDt = {
      start: combineDateWithTime(dailyShifts.date, shiftTime.value.start),
      stop: combineDateWithTime(dailyShifts.date, shiftTime.value.stop),
    }
    const response = await setManualShift(shiftDt, note.value)

    if (response.status === 'success') {
      await monthStore.refresh()
      closeModal();
    }
    alert.show(response.status, response.message)
  }

</script>

<template>
  <ModalWrapper v-if="isModalOpen" :close-modal="closeModal">

    <div
        class="
          bg-soft shadow-2xl text-white flex justify-center items-center box-border rounded-md p-3
          w-[75vw] max-w-[500px] min-w-[250px]
        "
    >
      <div class="p-2 w-full">
        <h3 class="text-beb font-bold text-xl">{{dt}}</h3>

<!--        ADD TOILS-->
        <div
          class="
          grid  m-3 rounded-md border border-silver bg-third

          portrait-2xs:grid-rows-[20px_auto]
          portrait-medium:grid-rows-[30px_auto]
          ">
        <h2
            class="
            text-mute bg-silver font-bold text-left px-2 w-full rounded-t-md

              portrait-2xs:text-sm
              portrait-medium:text-lg
              "
        >
          ADD TOILS
        </h2>
        <ShiftDetailContainer
          :label="'TOIL taken'"
          :time="formatTime(dailyShifts.selectedDay.toil?.duration_seconds || 0)"
          :orient="'row'"
          :text-color="dailyShifts.selectedDay.toil?.duration_seconds ? 'turquoise' : 'stone-700'"
        />

        <div
            v-show="!monthStore.selected.closed"
            class="rounded-md m-3 border border-silver">
          <OvertimeContainer />
        </div>
      </div>


<!--        ADD SHIFT-->
        <div
          class="
          grid  m-3 rounded-md border border-silver bg-third

          portrait-2xs:grid-rows-[20px_auto]
          portrait-medium:grid-rows-[30px_auto]
          ">
          <h2
              class="
              text-mute bg-silver font-bold text-left px-2 w-full rounded-t-md

                portrait-2xs:text-sm
                portrait-medium:text-lg
                "
          >
            ADD SHIFT
          </h2>

          <form @submit.prevent="submitShift">
            <div class="flex flex-row justify-start items-center m-4">
              <label for="startTime" class="block text-base font-thin text-silver text-left mr-4">Start hour</label>
              <input
                v-model="shiftTime.start"
                type="time"
                id="startTime"
                class="block w-[100px] border text-black border-gray-300 rounded-md shadow-sm text-lg"
                required
              />
            </div>

            <div class="flex flex-row justify-start items-center m-4">
              <label for="endTime" class="block text-base font-thin text-silver text-left mr-4">Stop hour</label>
              <input
                v-model="shiftTime.stop"
                type="time"
                id="endTime"
                class="block w-[100px] border text-black border-gray-300 rounded-md shadow-sm text-lg"
                required
              />
            </div>

            <div class="m-4">
              <label for="note" class="block text-base font-thin text-silver text-left">Note</label>
              <textarea
                v-model="note"
                id="note"
                rows="3"
                class="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm text-lg resize-none placeholder:text-sm"
                placeholder="Add any notes about this shift..."
              ></textarea>
            </div>

            <div class="flex justify-end gap-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 bg-secondary rounded-md text-sm font-thin hover:bg-third"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="px-4 py-2 bg-secondary text-white rounded-md text-sm font-thin hover:bg-beb"
              >
                Save
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </ModalWrapper>
</template>



<style scoped>
</style>