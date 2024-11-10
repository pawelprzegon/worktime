<script setup>

import {defineProps} from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
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
  },
  color: {
    type: String,
    default: null
  }
})

</script>

<template>

  <button
      :class="['button', { 'active-button': props.isActive }]"
      type="button"
      :style="{
    width: props.width + 'px',
    padding: props.padding + 'px',
    margin: props.margin + 'px' ,
    fontSize: props.fontSize + 'px',
    color: props.color
  }"
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

.active-button {
  background-color: #007bff;
  color: #fff;
}

@media (orientation: landscape) {
  @media (max-width: 1300px) {
    .button {
      font-size: 10px;
      border-radius: 3px;
      width: 70px !important;
      margin: 5px !important;
      padding: 1px !important;
    }
  }
  @media (max-width: 800px) {
    .button {
      font-size: 10px;
      border-radius: 3px;
      width: 70px !important;
      margin: 5px !important;
      padding: 1px !important;
    }
  }
}

@media (orientation: portrait) {
  @media (max-width: 1300px) {
    .button {
      font-size: 10px;
      border-radius: 3px;
      width: 70px !important;
      margin: 5px !important;
      padding: 1px !important;
    }
  }
  @media (max-width: 800px) {
    .button {
      font-size: 10px;
      border-radius: 3px;
      width: 70px !important;
      margin: 5px !important;
      padding: 1px !important;
    }
  }
  @media (max-width: 450px) {
    .button {
      font-size: 11px !important;
      border-radius: 3px !important;
      width: 60px !important;
      margin: 3px !important;
      padding: 1px !important;
    }
  }
}

</style>