<script setup>

import {formatTime, getDate, getTime} from "@/utils.js";
import ShiftDetailContainer from "@/components/panel/details/ShiftDetailContainer.vue";
import ShiftNoteContainer from "@/components/panel/details/ShiftNoteContainer.vue";
import CustomTextButton from "@/components/utils/CustomTextButton.vue";
import {saveShiftNote} from "@/fetchers.js";
import Alert from "@/components/utils/Alert.vue";
import {inject, ref} from "vue";

const props = defineProps({
  shift: Object
})
const alert = inject('alert');
const emit = defineEmits(['refreshModal'])

const submitForm = () => {
  const form = document.querySelector('form');
  form.requestSubmit();
};

const getLastStartStop = (shift, type) => {
  // sprawdzanie czy są jakieś korekty i jeśli tak to nadpisanie nimi start i stop
  if (shift.time_correction.length > 0) {
    const filtered = shift.time_correction.filter(c => c.corrected === type);
    if (filtered.length > 0){
      return filtered[filtered.length -1]['date']
    }

  }
  switch (type) {
    case 'start':
      return shift.start
    case 'stop':
      return shift.stop
  }
}

const toggleShowNoteEditor = (shift) => {
  props.shift.isEditingNote = !props.shift.isEditingNote
}

const addNote = async (shift) => {
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
            :date="getDate(getLastStartStop(shift, 'start'))"
            :time="getTime(getLastStartStop(shift, 'start'))"
            :class="{'has-corrections': shift.time_correction.some(c => c.corrected === 'start')}"
        />
        <ShiftDetailContainer
            :label="'stop'"
            :date="getDate(getLastStartStop(shift, 'stop'))"
            :time="getTime(getLastStartStop(shift, 'stop'))"
            :class="{'has-corrections': shift.time_correction.some(c => c.corrected === 'stop')}"
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
        :width="80"
        :padding="2"
        :margin="2"
        @click="toggleShowNoteEditor(shift)"
      />
      <CustomTextButton
        v-if="!shift.isEditingNote && props.shift.noteContent == ''"
        label="add note"
        :width="80"
        :padding="2"
        :margin="2"
        @click="toggleShowNoteEditor(shift)"
      />

      <CustomTextButton
        v-if="shift.isEditingNote"
        label="save"
        :width="80"
        :padding="2"
        :margin="2"
        @click="submitForm"
        style="margin-left: auto"
      />

      <CustomTextButton
        v-if="shift.isEditingNote"
        label="cancel"
        :width="80"
        :padding="2"
        :margin="2"
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

textarea {
  background-color: var(--color-background-mute);
  color: #fff;
  border: 1px solid #444;
  padding: 10px;
  font-size: 14px;
  font-family: Poppins, sans-serif;
  border-radius: 5px;
  width: 95%;
  height: 85%;
  resize: none;
}

textarea:focus {
  outline: none;
  border-color: #777;
}

.has-corrections {
  position: relative;
}

.has-corrections::after {
  content: '';
  position: absolute;
  top: 1px;
  right: 10px;
  width: 5px;
  height: 5px;
  background-color: #c41313;
  border-radius: 50%;
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