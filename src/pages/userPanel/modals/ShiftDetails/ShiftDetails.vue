<script setup>
import CorrectionsContainer from "@/pages/userPanel/modals/ShiftDetails/CorrectionsContainer.vue";
import NoteContainer from "@/pages/userPanel/modals/ShiftDetails/NoteContainer.vue";
import OvertimeContainer from "@/pages/userPanel/modals/ShiftDetails/OvertimeContainer.vue";


const props = defineProps({
  shift: {
    type: Object,
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
      'transition-all duration-500 ease-in-out w-full overflow-auto',
      props.isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
    ]"
  >
    <div class="grid grid-flow-row auto-rows-min">
      <!-- Sekcja notatki -->
      <div
          class="
          grid  m-3 rounded-md border border-silver bg-third

          portrait-2xs:grid-rows-[20px_auto]
          portrait-medium:grid-rows-[30px_auto]
          ">
        <h2
            class="
            text-mute bg-silver font-bold text-left px-2 w-full rounded-t-md

              portrait-2xs:text-sm
              portrait-medium:text-lg
              "
        >NOTE</h2>
        <NoteContainer :shift="props.shift"/>
      </div>

      <!-- Sekcja poprawek -->
      <div
          class="
          grid  m-3 rounded-md border border-silver bg-third

          portrait-2xs:grid-rows-[20px_auto]
          portrait-medium:grid-rows-[30px_auto]
          ">
        <h2
            class="
            text-mute bg-silver font-bold text-left px-2 w-full rounded-t-md

              portrait-2xs:text-sm
              portrait-medium:text-lg
              "
        >CORRECTION</h2>
        <CorrectionsContainer :shift="props.shift"/>
      </div>

    </div>
  </div>

</template>

<style scoped>
</style>