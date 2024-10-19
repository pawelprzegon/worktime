<script setup>

import {ref, defineEmits} from 'vue'
import NoteModal from "@/components/user/NoteModal.vue";

const isModalOpen = ref(false)
const emit = defineEmits(['passNote'])


const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const passNote = (note) => {
  emit("passNote", note)
}

</script>

<template>

  <small
      class="note-button"
      @click="openModal"
  >
    add note
  </small>
  <NoteModal
      v-if="isModalOpen"
      @close="closeModal"
      @addNote="passNote"
  />

</template>

<style scoped>

.note-button {
  padding: 2px;
}

.note-button:hover {
  color: black;
  background: lightgray;
  border-radius: 5px;
  cursor: pointer;
}

</style>