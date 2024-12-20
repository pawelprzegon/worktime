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
    :class="['avatar', {
      'off': !activeShift,
      'no-click': static
    }]"
    :src="`${apiURL}/${avatar}`"
    alt="avatar"
    @click="shiftToggle"
  >

</template>

<style scoped>

.avatar {
  width: 100px;
  height: 100px;
  margin: auto;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}

.avatar:hover {
  cursor: pointer;
  filter: grayscale(50%);
}

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