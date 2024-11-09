<script setup>

const props = defineProps({
  label: String,
  note: String,
})



</script>

<template>

  <div class="shift-note">
    <label>{{props.label}}:</label>
    <span>
      {{props.note}}
    </span>

  </div>

</template>

<style scoped>

.shift-note {
  display: flex;
  flex-direction: column;
  padding: 0 15px;
}

.shift-note label {
  border-bottom: 1px solid #696969;
}

.shift-note > span {

  word-break: break-all;
}

</style>