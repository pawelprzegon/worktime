
<script setup>
  import { ref } from 'vue';
  import ModalWrapper from "@/components/ModalWrapper.vue";
  import {combineDateWithTime, getDateString} from "@/composables/utils.js";
  import {setManualShift} from "@/composables/fetchers.js";

  const isModalOpen = ref(true);
  const shiftTime = ref({
    start: '',
    stop: ''
  });

  const note = ref('')

  const props = defineProps({
    closeModal: Function,
    date: Date
  })

  const dt = getDateString(props.date)



  const closeModal = () => {
    props.closeModal();
    isModalOpen.value = false;
  }

  function submitShift() {
    const shiftDt = {
      start: combineDateWithTime(shiftTime.value.start),
      stop: combineDateWithTime(shiftTime.value.stop),
    }
    const response = setManualShift(shiftDt, note.value)
    closeModal();
  }
</script>

<template>
  <ModalWrapper v-if="isModalOpen" :close-modal="closeModal">
    <div class="bg-soft shadow-2xl text-white flex justify-center items-center box-border rounded-md p-5">
      <div>
        <h2 class="text-white p-4 rounded-lg" >Add Shift</h2>
        <h3>{{dt}}</h3>
        <form @submit.prevent="submitShift">
          <div class="mb-4">
            <label for="startTime" class="block text-lg font-medium text-gray-400">Start hour</label>
            <input
              v-model="shiftTime.start"
              type="time"
              id="startTime"
              class="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              required
            />
          </div>

          <div class="mb-4">
            <label for="endTime" class="block text-xl font-medium text-gray-400">Stop hour</label>
            <input
              v-model="shiftTime.stop"
              type="time"
              id="endTime"
              class="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              required
            />
          </div>

          <div class="mb-4">
            <label for="note" class="block text-lg font-medium text-gray-400">Note</label>
            <textarea
              v-model="note"
              id="note"
              rows="3"
              class="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg resize-none"
              placeholder="Add any notes about this shift..."
            ></textarea>
          </div>

          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-300 rounded-md text-sm font-medium hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
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