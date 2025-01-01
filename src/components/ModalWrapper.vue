<script setup>
defineProps({
  closeModal: {
    type: Function,
    required: true,
  }
})
</script>

<template>
  <div
      class="
      z-40 w-100 h-100
      fixed inset-0
      bg-modal-back backdrop-blur
      flex items-center justify-center
      "
       @click="closeModal">
    <div class="place-items-center rounded-lg text-center w-fit min-w-[500px] mt-12" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>


<style scoped>
</style>
