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

.shift-note > h3 {
  word-break: break-all;
}

</style>