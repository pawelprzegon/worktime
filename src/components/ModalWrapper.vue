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
    <div class="rounded-lg text-center w-auto min-w-[300px] mt-36" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>


<style scoped>
</style>
