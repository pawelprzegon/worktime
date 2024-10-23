<script setup>

import {defineProps, defineEmits} from "vue";
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
  const date = new Date(props.activeShift.start)
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Warsaw',
  };

  const tz = new Intl.DateTimeFormat('pl-PL', options).format(date);
  return tz
}



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