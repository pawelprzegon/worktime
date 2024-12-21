<script setup>

const apiURL = import.meta.env.VITE_APP_API_URL

defineProps({
  avatar: String,
  activeShift: {
    type: Object,
    default: {}
  },
  static: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const shiftToggle = () => {
  emit("toggle")
}

</script>

<template>
  <img
    :class="['w-24 h-24 mx-auto object-cover object-center rounded-full cursor-pointer' +
    {
      'grayscale': !activeShift,
      'cursor-default': static
    }]"
    :src="`${apiURL}/${avatar}`"
    alt="avatar"
    @click="shiftToggle"
  >

</template>

<style scoped>


.off {
  filter: grayscale(100%);
}

.no-click {
  pointer-events: none;
  filter: grayscale(0%);
}

@media (max-width: 1300px) {
  .avatar {
    width: 90px;
    height: 90px;
  }
}

@media (max-width: 1000px) {
  .avatar {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 800px) {
  .avatar {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 600px) {
  .avatar {
    width: 60px;
    height: 60px;
  }
}

</style>