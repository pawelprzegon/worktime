<script setup>
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
  },
  background: {
    type: String,
    default: 'var(--color-background-mute)'
  }
})
</script>

<template>
  <button
      :class="[
      'flex items-center justify-center cursor-pointer box-border transition-all duration-200 text-sm rounded-md',
      { 'bg-indigo-500 text-white': props.isActive, 'bg-mute-gray': !props.isActive },
      { 'hover:bg-white hover:text-black hover:border-gray-300': !props.isActive }
    ]"
      :style="{
      width: props.width + 'px',
      padding: props.padding + 'px',
      margin: props.margin + 'px',
      fontSize: props.fontSize + 'px',
      backgroundColor: props.background
    }"
      type="button"
  >
    {{ props.label }}
  </button>
</template>

<style scoped>
/* Przykład dla tła i kolorów, które nie są zdefiniowane w Tailwind (jak var(--color-background-mute)) */
.bg-mute-gray {
  background-color: var(--color-background-mute);
}

@media (orientation: landscape) {
  @media (max-width: 800px) {
    button {
      font-size: 10px;
      border-radius: 3px;
      width: 70px !important;
      margin: 5px !important;
      padding: 1px !important;
    }
  }
}

@media (orientation: portrait) {

  @media (max-width: 800px) {
    button {
      font-size: 10px;
      border-radius: 3px;
      width: 75px !important;
      margin: 7px !important;
      padding: 3px !important;
    }
  }
  @media (max-width: 500px) {
    button {
      font-size: 11px !important;
      border-radius: 3px !important;
      width: 65px !important;
      margin: 3px !important;
      padding: 2px !important;
    }
  }
}

</style>
