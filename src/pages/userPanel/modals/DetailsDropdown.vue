<script setup>
  import { ref, defineEmits } from 'vue'

  const emit = defineEmits(['open'])

  const isOpen = ref(false)

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
    emit("open", isOpen.value)
  }

</script>

<template>

    <button
      @click="toggleDropdown"
      class="font-thin"
      :class="isOpen ? 'text-white' : 'text-silver'"
    >
      <slot></slot>
    </button>

</template>

<style scoped>

</style>