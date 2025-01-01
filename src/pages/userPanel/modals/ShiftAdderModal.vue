<script setup>
  import { ref } from 'vue';
  import ModalWrapper from "@/components/ModalWrapper.vue";
  import {combineDateWithTime, getDateString} from "@/composables/utils.js";
  import {setManualShift} from "@/composables/fetchers.js";
  import {useDailyShiftsList} from "@/stores/calendarStore.js";
  import {useSelectedMonthStore} from "@/stores/utilsStore.js";

  const monthStore = useSelectedMonthStore('calendar')
  const dailyShifts = useDailyShiftsList();

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

  function submitShift() {
    const shiftDt = {
      start: combineDateWithTime(dailyShifts.date, shiftTime.value.start),
      stop: combineDateWithTime(dailyShifts.date, shiftTime.value.stop),
    }
    setManualShift(shiftDt, note.value)
    monthStore.refresh()
    closeModal();
  }
</script>

<template>
  <ModalWrapper v-if="isModalOpen" :close-modal="closeModal">
    <div
        class="
          bg-soft shadow-2xl text-white flex justify-center items-center box-border rounded-md p-3
          w-[75vw] max-w-[500px] min-w-[250px]
        ">
      <div class="p-2 w-full">
        <h3 class="text-beb font-bold text-xl">{{dt}}</h3>
        <h3 class="text-silver text-base p-4 rounded-lg" >Add Shift</h3>

        <form @submit.prevent="submitShift">
          <div class="flex flex-row justify-start items-center mb-4">
            <label for="startTime" class="block text-base font-thin text-silver text-left mr-4">Start hour</label>
            <input
              v-model="shiftTime.start"
              type="time"
              id="startTime"
              class="block w-[100px] border text-black border-gray-300 rounded-md shadow-sm text-lg"
              required
            />
          </div>

          <div class="flex flex-row justify-start items-center mb-4">
            <label for="endTime" class="block text-base font-thin text-silver text-left mr-4">Stop hour</label>
            <input
              v-model="shiftTime.stop"
              type="time"
              id="endTime"
              class="block w-[100px] border text-black border-gray-300 rounded-md shadow-sm text-lg"
              required
            />
          </div>

          <div class="mb-4">
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
  </ModalWrapper>
</template>



<style scoped>
</style>