<script setup>

const props = defineProps({
  label: String,
  data: String,
  background: String
})



</script>

<template>

  <div class="shift-detail" :style="{background: props.background}">
    <label>{{props.label}}:</label>
    <span>
      {{props.data}}
    </span>

  </div>

</template>

<style scoped>

.shift-detail {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 5px;
  padding: 1px;
  margin: 0 0 1px 0;
  width: 100%;
}

</style>