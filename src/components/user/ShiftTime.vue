<script setup>

import {defineEmits, defineProps} from "vue";
import Note from "@/components/user/Note.vue";

const props = defineProps({
  activeShift: Object,
  shiftDuration: String
})

const emit = defineEmits(['passNote'])

const passNote = (note) => {
  emit('passNote', note)
}

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
    <Note
        @pass-note="passNote"
    />
  </section>

</template>

<style scoped>

.shift {
  font-size: 1rem;
}

.shift-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>