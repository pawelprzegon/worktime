<script setup>
import CorrectionsContainer from "@/pages/userPanel/modals/ShiftDetails/CorrectionsContainer.vue";
import NoteContainer from "@/pages/userPanel/modals/ShiftDetails/NoteContainer.vue";


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
      'transition-all duration-500 ease-in-out w-full overflow-auto',
      props.isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
    ]"
  >
    <div class="grid grid-flow-row auto-rows-min">
      <!-- Sekcja notatki -->
      <div
          class="
          grid m-3 rounded-md border border-pigeon

          portrait-2xs:grid-rows-[15px_auto]
          portrait-medium:grid-rows-[18px_auto]
          ">
        <h2
            class="
            text-mute bg-pigeon font-bold text-left px-2 w-full rounded-t-md

              portrait-2xs:text-sm
              portrait-medium:text-md
              "
        >NOTE</h2>
        <NoteContainer :shift-id="shiftId"/>
      </div>

      <!-- Sekcja poprawek -->
      <div
          class="
          grid m-3 rounded-md border border-pigeon

          portrait-2xs:grid-rows-[15px_auto]
          portrait-medium:grid-rows-[18px_auto]
          ">
        <h2
            class="
            text-mute bg-pigeon font-bold text-left px-2 w-full rounded-t-md

              portrait-2xs:text-sm
              portrait-medium:text-md
              "
        >CORRECTION</h2>
        <CorrectionsContainer :shift-id="shiftId"/>
      </div>

    </div>
  </div>

</template>

<style scoped>
</style>