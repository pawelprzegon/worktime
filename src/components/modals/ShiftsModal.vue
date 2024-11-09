<script setup>
import {defineEmits, computed, ref} from 'vue';
import {formatTime, getTime} from "@/utils.js";
import ShiftDetailContainer from "@/components/panel/ShiftDetailContainer.vue";
import ShiftNoteContainer from "@/components/panel/ShiftNoteContainer.vue";
import CustomButton from "@/components/utils/CustomButton.vue";
import {saveShiftNote} from "@/fetchers.js";
import {loggedUserId} from "@/auth.js";

const props = defineProps({

  defaultProp: {
    type: Object,
    default: () => []
  }
})

const date = computed(() => {
  if (props.defaultProp.length > 0) {
    return props.defaultProp[0].start.split("T")[0];
  }
  return '';
});

const emit = defineEmits(['closeModal', 'refreshShifts'])

const showNoteEditor = (shift) => {
  shift.isEditingNote = true;
  shift.noteContent = shift.note || '';
};

const addNote = (shift) => {
  saveShiftNote(loggedUserId.value, shift.id, shift.noteContent)
  shift.isEditingNote = false;
  emit('refreshShifts')
  emit('closeModal')
};

</script>

<template>
  <div v-if="props.defaultProp.length > 0" class="shifts-container">
    <div class="shifts-label">
      <h2>Daily shifts:</h2>
      <h2>{{ date }}</h2>
    </div>


    <div v-for="shift in props.defaultProp" :key="shift.id" class="shift-details-container">
      <div class="shift-details">
        <ShiftDetailContainer :label="'start'" :data="getTime(shift.start)" />
        <ShiftDetailContainer :label="'stop'" :data="getTime(shift.stop)" />
        <ShiftDetailContainer :label="'work'" :data="formatTime(shift.work)" />
      </div>

      <div class="shift-note">
        <ShiftNoteContainer
            v-if="shift.note"
            :label="'note'"
            :note="shift.note"
        />
        <CustomButton
            v-if="shift.note && !shift.isEditingNote"
            label="edit"
            :width="60"
            :padding="2"
            :margin="2"
            @click="showNoteEditor(shift)"
            style="margin-left: auto; margin-right: 15px"
          />
        <CustomButton
          v-else
          v-show="!shift.isEditingNote"
          label="add note"
          @click="showNoteEditor(shift)"
        />

        <form
            v-if="shift.isEditingNote"
            @submit.prevent="addNote(shift)"
            style="width: 90%"
        >
          <textarea
            style="border-radius: 5px"
            v-model="shift.noteContent"
            id="noteEditor"
            name="noteEditor"
            rows="5"
          />
          <CustomButton
            label="save note"
            :width="60"
            :padding="2"
            :margin="2"
            type="submit"
            style="margin-left: auto"
          />
        </form>

      </div>
    </div>
  </div>
</template>

<style scoped>

.shifts-container {
  background-color: gray;
  color: #fff;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
}

.shift-details-container {
  display: grid;
  grid-template-columns: 40% auto;
  grid-column-gap: 5px;
  background: #353535;
  padding: 5px;
  margin: 0 0 5px 0;
  font-size: 13px;
  border-radius: 5px;
}

.shifts-label {
  color: #212121;
}

.shift-details {
  display: grid;
  grid-auto-rows: auto;
  height: fit-content;
  min-width: 100px;
}

.shift-note {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

#noteEditor {
  width: 95%;
  max-width: 500px;
}

@media (max-width: 768px) {
  #noteEditor {
    max-width: 300px;
  }
}
</style>
