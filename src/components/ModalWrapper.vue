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
      block place-items-center
      z-40 w-100 h-100
      fixed inset-0
      bg-modal-back backdrop-blur
      "
       @click="closeModal">
    <div class="place-items-center  rounded-lg text-center w-fit min-w-[500px] mt-36" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>


<style scoped>
</style>
