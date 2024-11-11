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

.shift-section small{
  text-align: center;
}

@media (max-width: 1300px) {
  .shift {
    font-size: 13px;
  }
}

@media (max-width: 1000px) {
  .shift {
    font-size: 11px;
  }
}

@media (max-width: 800px) {
  .shift {
    font-size: 10px;
  }
}

@media (max-width: 600px) {
  .shift {
    font-size: 9px;
  }
}

</style>