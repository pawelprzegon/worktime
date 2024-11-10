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

const emit = defineEmits(['closeModal', 'toggleShift', 'removeShift'])

const closeModal = () => {
  emit('closeModal')
}

const toggleShift = () => {
  emit('toggleShift')
}

const removeShift = (shiftId) => {
  emit('removeShift', shiftId)
}

const refreshModal = () => {
  emit('refreshModal')
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
          @removeShift="removeShift"
          @refreshModal="refreshModal"
      />
    </div>
  </div>
</template>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(64, 64, 64, 0.84);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  border-radius: 8px;
  text-align: center;
  min-width: 60%;
  max-width: 65%;
  margin: auto;
}

@media (max-width: 1300px) {
  .modal-content {
    min-width: 60%;
    max-width: 65%;
  }
}

@media (max-width: 800px) {
  .modal-content {
    min-width: 70%;
    max-width: 75%;
  }
}

@media (max-width: 600px) {
  .modal-content {
    min-width: 85%;
    max-width: 90%;
  }
}

</style>
