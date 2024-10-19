<script setup>

import {defineProps} from "vue";

const props = defineProps({
  firstName: String,
  lastName: String
})

</script>

<template>

  <section class="name-section">
    <small class="label">{{props.firstName}}</small>
    <small class="label">{{props.lastName}}</small>
  </section>

</template>

<style scoped>

.name-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.label {
  font-size: 1rem;
  margin: 3px;
}

</style>