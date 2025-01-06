<script setup>
import ToilContainer from "@/pages/userPanel/modals/ShiftDetails/ToilContainer.vue";
import {usedayStore} from "@/stores/calendarStore.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";

const monthStore = useSelectedMonthStore('calendar');
const dayStore = usedayStore();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  }
});

const isToilActive = () => {
  return dayStore.regular + dayStore.overtime < 28800;
}


</script>

<template>
  <div
      v-show="isToilActive() && !monthStore.selected.closed"
      :class="[
      'transition-all duration-500 ease-in-out overflow-auto',
      props.isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
    ]"
  >
    <ToilContainer />
  </div>

</template>

<style scoped>
</style>