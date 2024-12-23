<script setup>

import ShiftNoteContainer from "@/pages/userPanel/ShiftNoteContainer.vue";

const props = defineProps({
  shift: {
    type: Object,
    required: true
  },
})



</script>

<template>

  <div class="grid grid-rows-3 ">

    <div class="grid grid-flow-row">
      <h2 class="text-silver text-left p-2 ml-1">Note</h2>
      <div :class="['shift-note-container', {'bottom': !shift.isEditingNote && !shift.note}]">
        <ShiftNoteContainer
            v-if="shift.note && !shift.isEditingNote"
            :label="'note'"
            :note="shift.note"
        />

        <form
            @submit.prevent="addNote(shift)"
            ref="noteForm"
        >
          <textarea
            style="border-radius: 5px; width: 95%"
            v-model="shift.noteContent"
            id="noteEditor"
            name="noteEditor"
            rows="3"
          />
        </form>

      </div>
    </div>

    <div class="grid grid-rows-2">
      <h2 class="text-silver text-left p-2 ml-1">Corrections</h2>
      <div class="grid grid-cols-2">
        <p>text</p>
        <p>text 2</p>
      </div>
    </div>

    <div class="grid grid-rows-2">
      <h2 class="text-silver text-left p-2 ml-1">Overtimes</h2>
      <div class="grid grid-cols-2">
        <p>text</p>
        <p>text 2</p>
      </div>

    </div>


  </div>


</template>

<style scoped>

</style>