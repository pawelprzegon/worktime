<script setup>

import {defineProps} from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  padding: {
    type: Number,
    default: 5
  },
  margin: {
    type: Number,
    default: 5
  },
  width: {
    type: Number,
    default: 100
  },
  fontSize: {
    type: Number,
    default: 13
  }
})

</script>

<template>

  <button
      class="button"
      type="button"
      :style="{ width: props.width + 'px', padding: props.padding + 'px', margin: props.margin + 'px' , fontSize: props.fontSize + 'px'}"
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

@media (max-width: 700px) {
  .button {
    font-size: 10px;
    border-radius: 3px;
    width: 70px !important;
    margin: 5px !important;
    padding: 1px !important;
  }
}

</style>