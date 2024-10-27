<script setup>

import {defineProps} from 'vue'

const props = defineProps({
  label: String,
  padding: Number,
  margin: Number,
  width: Number
})

</script>

<template>

  <button
      class="button"
      type="button"
      :style="{ width: props.width + 'px', padding: props.padding + 'px', margin: props.margin + 'px' }"
  >{{props.label}}</button>

</template>

<style scoped>

.button {
  align-items: center;
  background-color: transparent;
  border: 1px solid gray;
  border-radius: 6px;
  box-sizing: border-box;
  color: #9f9f9f;
  cursor: pointer;
  display: flex;
  font-size: 18px;
  justify-content: center;
  line-height: 28px;
  text-decoration: none;
  transition: all .2s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button:active,
.button:hover {
  outline: 0;
}

.button:hover {
  background-color: #FFFFFF;
  color: black;
  border-color: rgba(0, 0, 0, 0.19);
}

</style>