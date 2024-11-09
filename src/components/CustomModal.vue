<script setup>
import {defineEmits} from 'vue';

const props = defineProps({
  modalComponent: {
    type: Object,
    required: true,
  },
  modalProps: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['closeModal', 'toggleShift'])

const closeModal = () => {
  emit('closeModal')
}

const toggleShift = () => {
  emit('toggleShift')
}

</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <component
          :is="props.modalComponent"
          :defaultProp="props.modalProps"
          @closeModal="closeModal"
          @toggleShift="toggleShift"
          @refreshShifts="toggleShift"
      />
    </div>
  </div>
</template>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.54);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #3d3d3d;
  border-radius: 8px;
  text-align: center;
  min-width: 500px;
  max-width: 600px;
}

@media (max-width: 1300px) {
  .modal-content {
    min-width: 300px;
    max-width: 400px;
  }
}

</style>
