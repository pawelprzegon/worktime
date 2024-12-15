
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
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 class="text-xl font-bold mb-4">Dodaj zmianę pracownika</h2>

        <form @submit.prevent="submitShift">
          <!-- Pole godziny rozpoczęcia -->
          <div class="mb-4">
            <label for="startTime" class="block text-sm font-medium text-gray-700">Godzina rozpoczęcia</label>
            <input
              v-model="shift.startTime"
              type="time"
              id="startTime"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <!-- Pole godziny zakończenia -->
          <div class="mb-4">
            <label for="endTime" class="block text-sm font-medium text-gray-700">Godzina zakończenia</label>
            <input
              v-model="shift.endTime"
              type="time"
              id="endTime"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              Anuluj
            </button>

            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  </ModalWrapper>
</template>



<style scoped>
/* Dodaj własne style lub użyj TailwindCSS */
</style>