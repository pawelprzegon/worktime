<script setup>
  import { ref } from 'vue'

  const isOpen = ref(false)

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }

</script>

<template>
  <div class="w-full">
    <button
      @click="toggleDropdown"
      class="font-thin px-2 py-1"
      :class="isOpen ? 'text-white' : 'text-silver'"
    >
      <span v-if="isOpen">▲</span>
      <span v-else>▼</span>
      more
    </button>

    <div
      v-show="isOpen"
      class="mt-2 p-1"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>