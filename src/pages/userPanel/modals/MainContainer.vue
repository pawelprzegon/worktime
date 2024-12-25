<script setup>
// Stare
import {formatTime, getDate, getLastCorrectionUpdate, getTime} from "@/composables/utils.js";
import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";
import ShiftNoteContainer from "@/pages/userPanel/ShiftNoteContainer.vue";
import CustomTextButton from "@/components/CustomTextButton.vue";
import {saveShiftNote} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";

const alert = useAlertStore()

const props = defineProps({
  shift: Object
})
const start = props.shift.update.length > 0 ? getLastCorrectionUpdate(props.shift).start : props.shift.start
const stop = props.shift.update.length > 0 ? getLastCorrectionUpdate(props.shift).stop : props.shift.stop

const emit = defineEmits(['refreshModal'])

const submitForm = () => {
  const form = document.querySelector('form');
  form.requestSubmit();
};

const toggleShowNoteEditor = () => {
  props.shift.isEditingNote = !props.shift.isEditingNote
}

const addNote = async () => {
  const response = await saveShiftNote(props.shift.user_id, props.shift.id, props.shift.noteContent)

  if (response) {
    emit('refreshModal');
    alert.show(response.status, response.message)
    if (response.ok) {
      props.shift.isEditingNote = false;
    }
  }
};

</script>

<template>
  <div class="main-container">

    <section class="shift-details">

      <div class="shift-details-data">
        <ShiftDetailContainer
            :label="'start'"
            :date="getDate(start)"
            :time="getTime(start)"
        />
        <ShiftDetailContainer
            :label="'stop'"
            :date="getDate(stop)"
            :time="getTime(stop)"
        />
        <ShiftDetailContainer
            :label="'work'"
            :time="formatTime(shift.work)"
        />
      </div>

      <div :class="['shift-note-container', {'bottom': !shift.isEditingNote && !shift.note}]">
        <ShiftNoteContainer
            v-if="shift.note && !shift.isEditingNote"
            :label="'note'"
            :note="shift.note"
        />

        <form
            v-if="shift.isEditingNote"
            @submit.prevent="addNote(shift)"
            ref="noteForm"
        >
          <textarea
            style="border-radius: 5px; width: 95%"
            v-model="shift.noteContent"
            id="noteEditor"
            name="noteEditor"
            rows="5"
          />
        </form>

      </div>

    </section>

    <section class="shift-details-header">
      <CustomTextButton
        v-if="!shift.isEditingNote && props.shift.noteContent !== ''"
        label="edit"
        @click="toggleShowNoteEditor(shift)"
      />
      <CustomTextButton
        v-if="!shift.isEditingNote && props.shift.noteContent === ''"
        label="add note"
        @click="toggleShowNoteEditor(shift)"
      />

      <CustomTextButton
        v-if="shift.isEditingNote"
        label="save"
        @click="submitForm"
      />

      <CustomTextButton
        v-if="shift.isEditingNote"
        label="cancel"
        @click="shift.isEditingNote = false"
      />

    </section>

  </div>

</template>

<style scoped>

.main-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  font-size: 13px;
  border-radius: 5px 5px 0 5px;
  background: var(--color-background-light);
  height: 200px;
}

.shift-details {
  display: grid;
  grid-template-columns: 40% 60% ;
  padding: 5px;
  font-size: 13px;
}

.shift-details-data {
  display: grid;
  grid-auto-rows: auto;
  height: fit-content;
  min-width: 100px;
}

.shift-note-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end
}

.bottom {
  justify-content: end !important;
}

form {
  width: 100%;
}



#noteEditor {
  max-width: 500px;
}

@media (max-width: 800px) {
  #noteEditor {
    max-width: 300px;
  }

  .has-corrections::after {
    top: 1px;
    right: 5px;

  }
}

@media (max-width: 600px) {
  .has-corrections::after {
    top: 1px;
    right: 1px;
  }
}

</style>