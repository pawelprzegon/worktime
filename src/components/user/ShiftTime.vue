<script setup>

const props = defineProps({
  activeShift: Object,
  shiftDuration: String
})


const formatDuration = () => {
  const utcDate = new Date(props.activeShift.start);

  return utcDate.toLocaleString("pl-PL", {
    timeZone: "Europe/Warsaw"
  });
};



</script>

<template>

  <section class="shift-section" v-if="props.activeShift">
    <small>{{formatDuration()}}</small>
    <p class="shift" id="shift" >{{ props.shiftDuration }}</p>
  </section>

</template>

<style scoped>

.shift {
  font-size: 15px;
}

.shift-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (max-width: 1300px) {
  .shift {
    font-size: 13px;
  }
}

</style>