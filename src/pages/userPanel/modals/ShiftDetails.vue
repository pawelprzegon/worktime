<script setup>
import {ref} from "vue";
import ShiftNoteContainer from "@/pages/userPanel/ShiftNoteContainer.vue";
import {saveShiftNote} from "@/composables/fetchers.js";
import CustomTextButton from "@/components/CustomTextButton.vue";
import {useAlertStore} from "@/stores/alertStore.js";

const alert = useAlertStore()

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

const noteEdit = ref(false)

const toggleShowNoteEditor = () => {
  noteEdit.value = !noteEdit.value
}

const submitForm = () => {
  const form = document.querySelector('form');
  form.requestSubmit();
};

const addNote = async () => {
  const response = await saveShiftNote(props.shift.user_id, props.shift.id, props.shift.noteContent)
  if (response) {
    alert.show(response.status, response.message)
    noteEdit.value = false;
  }
};

</script>

<template>
  <div
    :class="[
      'transition-all duration-500 ease-in-out overflow-hidden w-full',
      props.isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
    ]"
  >
    <div class="grid grid-rows-3 ">
      <!-- Sekcja notatki -->
      <div class="grid grid-flow-row m-2 bg-secondary rounded-md">
        <h2 class="text-silver text-left px-2 ml-1">Note</h2>
        <div
          class="h-full">
          <ShiftNoteContainer
            v-if="shift.note && !noteEdit"
            :note="shift.note"
          />

          <form
              v-if="noteEdit"
              @submit.prevent="addNote(shift)" ref="noteForm">
            <textarea
              class="border rounded-md w-[95%] text-black"
              v-model="shift.noteContent"
              id="noteEditor"
              name="noteEditor"
              rows="3"
            />
          </form>
          <CustomTextButton
            v-if="!noteEdit && props.shift.noteContent !== ''"
            label="edit"
            @click="toggleShowNoteEditor(shift)"
          />
          <CustomTextButton
            v-if="!noteEdit && props.shift.noteContent === ''"
            label="add note"
            @click="toggleShowNoteEditor(shift)"
          />
          <CustomTextButton
            v-if="noteEdit"
            label="save"
            @click="submitForm"
          />
        </div>
      </div>

      <!-- Sekcja poprawek -->
      <div class="grid grid-rows-2 bg-secondary m-2 rounded-md">
        <h2 class="text-silver text-left p-2 ml-1">Corrections</h2>
        <div class="grid grid-cols-2">
          <p>text</p>
          <p>text 2</p>
        </div>
      </div>

      <!-- Sekcja nadgodzin -->
      <div class="grid grid-rows-2 bg-secondary m-2 rounded-md">
        <h2 class="text-silver text-left p-2 ml-1">Overtimes</h2>
        <div class="grid grid-cols-2">
          <p>text</p>
          <p>text 2</p>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
</style>