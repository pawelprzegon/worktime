<script setup>
defineProps({
  closeModal: {
    type: Function,
    required: true,
  }
})
</script>

<template>
  <div class="
  flex justify-center items-start
  z-50 w-100 h-100
  fixed inset-0
  bg-modal-back backdrop-blur" @click="closeModal">
    <div class="rounded-lg text-center w-auto min-w-[300px] mt-36" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>


<style scoped>
</style>
