<script setup>

import CustomTextButton from "@/components/CustomTextButton.vue";
import {ref} from "vue";
import {saveShiftNote} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";

const alert = useAlertStore()

const props = defineProps({
  shift: {
    type: Object,
    required: true,
  }
});

const noteContent = ref(props.shift.note)
const noteEdit = ref(false)

const toggleShowNoteEditor = () => {
  noteEdit.value = !noteEdit.value
}

const submitForm = () => {
  const form = document.querySelector('form');
  form.requestSubmit();

};

const addNote = async () => {
  const response = await saveShiftNote(props.shift.user_id, props.shift.id, noteContent.value)
  if (response) {
    alert.show(response.status, response.message)
    noteEdit.value = false;
  }
};

</script>

<template>

  <div
      class="grid mt-2"
      :class="props.shift.note ? 'grid-rows-[auto_50px]' : 'grid-rows-1'"
  >

    <div
        v-if="props.shift.note && !noteEdit"
        class="shift-note text-left px-3">
      <h3>{{props.shift.note}}</h3>
    </div>

    <form
        v-if="noteEdit"
        @submit.prevent="addNote(shift)" ref="noteForm">
      <textarea
        class="rounded-md w-[95%] p-1 text-black"
        v-model="noteContent"
        id="noteEditor"
        name="noteEditor"
        rows="2"
      />
    </form>
    <div class="place-items-end">
      <CustomTextButton
        v-if="!noteEdit && props.shift.note !== ''"
        label="edit"
        @click="toggleShowNoteEditor(shift)"
      />
      <CustomTextButton
        v-if="!noteEdit && props.shift.note === ''"
        label="add note"
        @click="toggleShowNoteEditor(shift)"
      />
      <div
          v-if="noteEdit"
          class="grid grid-flow-col">
        <CustomTextButton
          label="save"
          @click="submitForm"
        />
        <CustomTextButton
          label="cancel"
          @click="toggleShowNoteEditor(shift)"
        />
      </div>
    </div>


  </div>

</template>

<style scoped>

</style>