<script setup>
import CorrectionsContainer from "@/pages/userPanel/modals/CorrectionsContainer.vue";
import NoteContainer from "@/pages/userPanel/modals/NoteContainer.vue";


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

const emit = defineEmits(['refreshCalendar'])

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
      <div class="grid grid-rows-[30px_auto] m-3 rounded-md border border-silver bg-third">
        <h2 class="text-mute bg-silver font-bold text-lg text-left px-2 w-full rounded-t-md">NOTE</h2>
        <NoteContainer
            :shift="shift"
        />
      </div>

      <!-- Sekcja poprawek -->
      <div class="grid grid-rows-[30px_auto] m-3 rounded-md border border-silver bg-third">
        <h2 class="text-mute bg-silver font-bold text-lg text-left px-2 w-full rounded-t-md">CORRECT</h2>
        <CorrectionsContainer
            :shift="shift"
            @refresh-calendar="emit('refreshCalendar')"
        />
      </div>

      <!-- Sekcja nadgodzin -->
      <div class="grid grid-rows-[30px_auto] m-3 rounded-md border border-silver bg-third">
        <h2 class="text-mute bg-silver font-bold text-lg text-left px-2 w-full rounded-t-md">OVERTIME TAKEN</h2>
        <div class="grid grid-cols-2 mt-1">
          <p>text</p>
          <p>text 2</p>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
</style>