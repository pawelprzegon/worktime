<script setup>
import {defineEmits, computed, ref} from 'vue';
import {formatTime, getTime} from "@/utils.js";
import ShiftDetailContainer from "@/components/panel/ShiftDetailContainer.vue";
import ShiftNoteContainer from "@/components/panel/ShiftNoteContainer.vue";
import CustomButton from "@/components/utils/CustomButton.vue";
import {saveShiftNote} from "@/fetchers.js";
import {loggedUserId} from "@/auth.js";

const props = defineProps({

  shifts: {
    type: Array,
    default: () => []
  }
})

const date = computed(() => {
  if (props.shifts.length > 0) {
    return props.shifts[0].start.split("T")[0];
  }
  return '';
});

const emit = defineEmits(['close', 'refreshShifts'])

const closeModal = () => {
  emit('close')
}

const showNoteEditor = (shift) => {
  shift.isEditingNote = true;
  shift.noteContent = shift.note || '';
};

const addNote = (shift) => {
  saveShiftNote(loggedUserId.value, shift.id, shift.noteContent)
  shift.isEditingNote = false;
  emit('refreshShifts')
  emit('close')
};

</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div v-if="props.shifts.length > 0" class="shifts-container">
        <p>{{ date }}</p>

        <div v-for="shift in props.shifts" :key="shift.id" class="shift-details-container">
          <div class="shift-details">
            <ShiftDetailContainer :label="'started'" :data="getTime(shift.start)" />
            <ShiftDetailContainer :label="'stopped'" :data="getTime(shift.stop)" />
            <ShiftDetailContainer :label="'work'" :data="formatTime(shift.work)" />
          </div>

          <div class="shift-note">
            <ShiftNoteContainer v-if="shift.note" :label="'note'" :note="shift.note" />
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
                v-model="shift.noteContent"
                id="noteEditor"
                name="noteEditor"
                rows="5"
              />
              <CustomButton
                label="save"
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
    </div>
  </div>
</template>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.54);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #3d3d3d;
  border-radius: 8px;
  text-align: center;
  min-width: 500px;
  max-width: 600px;
}

.modal-label {
  display: block;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.shifts-container {
  background-color: gray;
  color: #fff;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
}

.shift-details-container {
  display: grid;
  grid-template-columns: 30% 70%;
  grid-column-gap: 10px;
  background: #454545;
  padding: 5px;
  margin: 0 0 5px 0;
  font-size: 13px;
  border-radius: 5px;
}

.shift-details {
  display: grid;
  grid-auto-rows: auto;
  height: fit-content;
}

.shift-note {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

#noteEditor {
  width: 100%;
  max-width: 500px;
}

@media (max-width: 1300px) {
  .modal-content {
    min-width: 300px;
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  #noteEditor {
    max-width: 300px;
  }
}
</style>
