
<script setup>
  import { ref } from 'vue';
  import ModalWrapper from "@/components/ModalWrapper.vue";

  const isModalOpen = ref(true);
  const shift = ref({
    startTime: '',
    endTime: ''
  });

  const props = defineProps({
    closeModal: Function
  })

  const closeModal = () => {
    props.closeModal();
    isModalOpen.value = false;
  }

  function submitShift() {
    console.log('Zapisane dane zmiany:', shift.value);
    closeModal();
  }
</script>

<template>
  <ModalWrapper v-if="isModalOpen" :close-modal="closeModal">
    <div class="bg-soft shadow-2xl text-white flex justify-center items-center box-border rounded-md p-5">
      <div>
        <h2 class="text-white p-4 rounded-lg" >Add Shift</h2>

        <form @submit.prevent="submitShift">
          <!-- Pole godziny rozpoczęcia -->
          <div class="mb-4">
            <label for="startTime" class="block text-lg font-medium text-gray-400">Start hour</label>
            <input
              v-model="shift.startTime"
              type="time"
              id="startTime"
              class="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              required
            />
          </div>

          <!-- Pole godziny zakończenia -->
          <div class="mb-4">
            <label for="endTime" class="block text-xl font-medium text-gray-400">Stop hour</label>
            <input
              v-model="shift.endTime"
              type="time"
              id="endTime"
              class="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              required
            />
          </div>

          <!-- Przyciski akcji -->
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