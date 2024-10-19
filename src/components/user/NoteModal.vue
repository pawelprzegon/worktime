<script setup>
import { ref, defineEmits } from 'vue'

const isOpen = ref(true)

const note = ref('')

const emit = defineEmits(['addNote', 'close'])

const closeModal = () => {
  isOpen.value = false
  emit('close')
}

const submitNote = () => {
  emit('addNote', note.value)
  closeModal()
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <label for="note" class="modal-label">Add note</label>
      <input type="text" id="note" v-model="note" class="modal-input" />
      <button class="modal-button" @click="submitNote">Submit</button>
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 300px;
}

.modal-label {
  display: block;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.modal-input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-button {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-button:hover {
  background-color: #0056b3;
}
</style>
