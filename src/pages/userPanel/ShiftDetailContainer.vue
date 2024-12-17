<script setup>

const props = defineProps({
  label: String,
  time: String,
  background: String
})



</script>

<template>

  <div
    :class="['shift-detail']"
    :style="{ background }">
    <p v-if="label">{{ label }}:</p>
    <h3>{{ time }}</h3>
  </div>

</template>

<style scoped>

.shift-detail {
  display: block;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 1px;
  margin: 0 0 1px 0;
  width: 100%;
}

.shift-detail p {
  color: gray;
  font-size: 10px;
}

.shift-detail h4 {
  padding: 2px;
  width: 90%;
}

.shift-detail h3 {
  padding: 2px;
  width: 90%;
  border-radius: 3px;
  margin: auto;
}

@media (max-width: 800px) {
  .shift-detail p {
    font-size: 10px;
  }

  .shift-detail h4 {
    font-size: 12px;
  }

  .shift-detail h3 {
    font-size: 13px;
  }
}

@media (max-width: 600px) {
  .shift-detail p {
    font-size: 10px;
  }

  .shift-detail h4 {
    font-size: 11px;
  }

  .shift-detail h3 {
    font-size: 12px;
  }
}

@media (max-width: 500px) {
  .shift-detail p {
    font-size: 9px;
  }

  .shift-detail h4 {
    font-size: 10px;
  }

  .shift-detail h3 {
    font-size: 10px;
  }
}

</style>