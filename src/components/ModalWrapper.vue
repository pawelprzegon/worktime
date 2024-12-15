<script setup>
import '@/assets/modal.css';
defineProps({
  closeModal: {
    type: Function,
    required: true,
  }
})
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>


<style scoped>
</style>
