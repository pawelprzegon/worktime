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
      class="
      w-24 h-24 mx-auto object-cover object-center rounded-full cursor-pointer

      portrait-2xs:w-20 portrait-2xs:h-20
      portrait-xs:w-22 portrait-xs:h-22
      portrait-small:w-22 portrait-small:h-22
      portrait-medium:w-28 portrait-medium:h-28
      portrait-large:w-28 portrait-large:h-28
      portrait-xl:w-28 portrait-xl:h-28
      "
    :class="[{
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