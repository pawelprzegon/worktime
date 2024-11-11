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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
}

.label {
  font-size: 15px;
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

@media (max-width: 1300px) {
  .label {
    font-size: 13px;
    margin: 0;
    padding: 0;
    line-height: 1.1;
  }
}

@media (max-width: 1000px) {
  .label {
    font-size: 12px;
    margin: 0;
    padding: 0;
    line-height: 1.1;
  }
}

@media (max-width: 800px) {
  .label {
    font-size: 11px;
    margin: 0;
    padding: 0;
    line-height: 1.1;
  }
}

@media (max-width: 600px) {
  .label {
    font-size: 10px;
    margin: 0;
    padding: 0;
    line-height: 1.1;
  }
}

</style>