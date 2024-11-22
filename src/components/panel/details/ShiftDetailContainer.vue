<script setup>

const props = defineProps({
  label: String,
  date: String,
  time: String,
  background: String
})



</script>

<template>

  <div
    :class="['shift-detail', label ? 'triple' : 'double']"
    :style="{ background }">
    <p v-if="label">{{ label }}:</p>
    <h4>{{ date }}</h4>
    <h3>{{ time }}</h3>
  </div>

</template>

<style scoped>

.shift-detail {
  display: grid;
  grid-template-columns: 2fr 2fr 2fr;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 1px;
  margin: 0 0 1px 0;
  width: 100%;
}

.double {
  grid-template-columns: 2fr 2fr;
}

.triple {
  grid-template-columns: 2fr 2fr 2fr;
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
  background: #3d3d3d;
  padding: 2px;
  width: 90%;
  border-radius: 3px;
}

@media (max-width: 800px) {
  .shift-detail p {
    font-size: 10px;
  }

  .shift-detail h3 {
    font-size: 12px;
  }
}

</style>