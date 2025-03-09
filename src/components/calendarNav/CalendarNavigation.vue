<script setup>

import {format} from "date-fns";
import CustomNaviButton from "@/components/CustomNaviButton.vue";


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
      <span
          class="
            nav-label
            below-portrait-2xs:max-w-[130px]
            portrait-2xs:max-w-[150px]
          "
      >
        {{ format(selectedMonth, 'MMMM yyyy') }}</span>
    <CustomNaviButton direction="next" size="20" @click="handleAdd"/>
  </div>
</template>

<style scoped>

.calendar-navigation {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.nav-label {
  width: 200px;
  display: block;
  text-align: center;
  margin: 5px 10px;
  font-size: 20px;
  color:var(--color-text-active)
}
</style>