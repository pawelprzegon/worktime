<script setup>
import CorrectionsContainer from "@/components/pages/userPanel/modals/ShiftDetails/CorrectionsContainer.vue";
import NoteContainer from "@/components/pages/userPanel/modals/ShiftDetails/NoteContainer.vue";
import ShiftLocations from "@/components/pages/userPanel/modals/ShiftDetails/ShiftLocations.vue";



const props = defineProps({
  shiftId: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  }
});

</script>

<template>
  <div
    :class="[
      'transition-all duration-500 ease-in-out w-full overflow-auto px-3',
      props.isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
    ]"
  >
    <div class="grid grid-flow-row auto-rows-min">

      <ShiftLocations :shift-id="shiftId" />
      <CorrectionsContainer :shift-id="shiftId"/>
      <NoteContainer :shift-id="shiftId"/>

    </div>
  </div>

</template>

<style scoped>
</style>