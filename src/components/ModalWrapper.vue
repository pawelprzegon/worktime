<script setup>
defineProps({
  closeModal: {
    type: Function,
    required: true,
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-modal-back bg-opacity-80 flex justify-center items-start z-50 w-100 h-100" @click="closeModal">
    <div class="rounded-lg text-center w-auto min-w-[300px] mt-36 p-4" @click.stop>
      <slot></slot>
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
  align-items: flex-start;
  z-index: 1000;
}

.modal-content {
  border-radius: 8px;
  text-align: center;
  width: fit-content;
  min-width: 300px;
  margin-top: 150px;
  padding: 10px;
}
</style>
