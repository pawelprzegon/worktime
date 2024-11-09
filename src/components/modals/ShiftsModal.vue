<script setup>
import {defineEmits, computed, ref, onBeforeUnmount} from 'vue';
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

const deleteConfirmationVisible = ref(false)

const date = computed(() => {
  if (props.defaultProp.length > 0) {
    return props.defaultProp[0].start.split("T")[0];
  }
  return '';
});

const emit = defineEmits(['closeModal', 'refreshShifts', 'removeShift'])

const showNoteEditor = (shift) => {
  shift.isEditingNote = true;
  shift.noteContent = shift.note || '';
};

const hideNoteEditor = (shift) => {
  shift.isEditingNote = false;
  shift.noteContent = '';
}

const addNote = (shift) => {
  saveShiftNote(loggedUserId.value, shift.id, shift.noteContent)
  shift.isEditingNote = false;
  emit('refreshShifts')
  emit('closeModal')
};

const deleteConfirmationVisibleToggle = (shiftId) => {
  deleteConfirmationVisible.value = deleteConfirmationVisible.value === shiftId ? null : shiftId;
}

const deleteConfirmed = (shiftId) => {
  emit('removeShift', shiftId)
}

onBeforeUnmount(() => {
  props.defaultProp.forEach(shift => {
    shift.isEditingNote = false
  })
})

</script>

<template>
  <div
      v-if="props.defaultProp.length > 0"
      class="shifts-container"
  >
    <div class="shifts-label">
      <h3>Daily shifts:</h3>
      <h3>{{ date }}</h3>
    </div>

    <div
        v-for="shift in props.defaultProp"
        :key="shift.id"
        class="shift-details-container"
    >
      <div
          v-if="deleteConfirmationVisible === shift.id"
          class="shift-delete-confirm"
      >
        <h3>delete shift?</h3>
        <div class="shift-delete-confirm-buttons">
          <CustomButton
              label="yes"
              color="black"
               @click="deleteConfirmed(shift.id)"
          />

          <CustomButton
              label="no"
              color="black"
               @click="deleteConfirmationVisibleToggle(shift.id)"
          />

        </div>
      </div>

      <div
          v-else
          class="shift-details"
          @click.self="hideNoteEditor(shift)"
      >

        <div class="shift-details-data">
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

          <img
              class="shift-delete"
              src="@/assets/img/delete.png"
              alt="delete"
              @click="deleteConfirmationVisibleToggle(shift.id)"
          >

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
  height: 150px;
  margin: 0 0 5px 0;
  background: #353535;
  padding: 5px;
}

.shift-delete-confirm {
  width: 100%;
  height: 100%;
  z-index: 1001;
  background-color: rgba(168, 75, 75, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.shift-delete-confirm-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.shift-details {
  display: grid;
  grid-template-columns: 40% 50% 6%;
  grid-column-gap: 1%;
  margin: 0 0 5px 0;
  font-size: 13px;
  border-radius: 5px;
  height: 100%;
}

.shifts-label {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  color: #212121;
}

.shift-details-data {
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

.shift-delete {
  filter: invert(40%);
}

.shift-delete:hover {
  cursor: pointer;
  filter: invert(100%)
}


@media (max-width: 768px) {
  #noteEditor {
    max-width: 300px;
  }
}
</style>
