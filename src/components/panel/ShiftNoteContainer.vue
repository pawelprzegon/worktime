<script setup>

const props = defineProps({
  label: String,
  note: String,
})



</script>

<template>

  <div class="shift-note">
    <p>{{props.label}}:</p>
    <h3>{{props.note}}</h3>

  </div>

</template>

<style scoped>

.shift-note {
  width: 100%;
  text-align: left;
  padding: 0 15px;
}

.shift-note p {
  color: gray
}

.shift-note h3 {
  word-break: break-all;
}

@media (max-width: 800px) {
  .shift-note h3 {
    font-size: 11px;
  }
}

@media (max-width: 600px) {
  .shift-note h3 {
    font-size: 10px;
  }
}

@media (max-width: 500px) {
  .shift-note h3 {
    font-size: 9px;
    font-weight: 100;
  }
}

</style>