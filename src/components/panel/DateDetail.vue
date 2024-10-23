<script setup>

import {defineProps, ref, onMounted} from 'vue'
import ShiftDetail from "@/components/panel/ShiftDetail.vue";


const props = defineProps({
  date: Object
})


</script>

<template>
  <div class="date-details">

    <h3>{{props.date.date}}</h3>

    <ShiftDetail
      v-for="shift in props.date.shifts"
      :shift="shift"
    />

  </div>



</template>

<style scoped>

.date-details {
  display: flex;
  flex-direction: column;
  background: var(--vt-c-black-mute);
  border-radius: 10px;
  padding: 10px;
  height: fit-content;
}

</style>