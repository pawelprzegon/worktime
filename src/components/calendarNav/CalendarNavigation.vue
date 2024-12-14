<script setup>

import {format} from "date-fns";
import CustomNaviButton from "@/components/CustomNaviButton.vue";
import '@/assets/calendarNavigation.css';


defineProps({selectedMonth: Date})
const emit = defineEmits(['sub', 'add']);

const handleSub = () => {
  emit('sub');
};

const handleAdd = () => {
  emit('add');
};
</script>

<template>
  <div class="calendar-navigation">
    <CustomNaviButton direction="preview" size="20" @click="handleSub"/>
      <span class="nav-label">{{ format(selectedMonth, 'MMMM yyyy') }}</span>
    <CustomNaviButton direction="next" size="20" @click="handleAdd"/>
  </div>
</template>

<style scoped>

</style>