<script setup>
import {defineEmits, computed, ref, onBeforeUnmount, inject} from 'vue';
import {formatTime, getTime} from "@/utils.js";
import ShiftDetailContainer from "@/components/panel/ShiftDetailContainer.vue";
import ShiftNoteContainer from "@/components/panel/ShiftNoteContainer.vue";
import CustomTextButton from "@/components/utils/CustomTextButton.vue";
import {saveShiftNote} from "@/fetchers.js";
import Alert from "@/components/utils/Alert.vue";


const alert = inject('alert');

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

const emit = defineEmits(['closeModal', 'removeShift', 'refreshModal', 'toggleShift', "refreshShifts"])

const showNoteEditor = (shift) => {
  shift.isEditingNote = true;
  shift.noteContent = shift.note || '';
};

const hideNoteEditor = (shift) => {
  shift.isEditingNote = false;
  shift.noteContent = '';
}

const addNote = async (shift) => {
  const loggedUserId = sessionStorage.getItem('userId')
  const response = await saveShiftNote(loggedUserId, shift.id, shift.noteContent)

  if (response) {
    shift.isEditingNote = false;
    emit('refreshModal');
    alert.show(response.status, response.message)
  }
};

const deleteConfirmationVisibleToggle = (shiftId) => {
  deleteConfirmationVisible.value = deleteConfirmationVisible.value === shiftId ? null : shiftId;
}

const deleteConfirmed = (shiftId) => {
  emit('removeShift', shiftId)
}

const submitForm = () => {
  const form = document.querySelector('form');
  form.requestSubmit();
};

onBeforeUnmount(() => {
  props.defaultProp.forEach(shift => {
    shift.isEditingNote = false
  })
})

</script>

<template>
  <Alert />
  <div
      v-if="props.defaultProp.length > 0"
      class="shifts-container"
  >
    <div class="shifts-label">
      <h2 style="font-weight: 600">{{ date }}</h2>
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
          <CustomTextButton
              label="yes"
              color="white"
              background="darkred"
              @click="deleteConfirmed(shift.id)"
          />

          <CustomTextButton
              label="no"
              color="white"
              background=""
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

      </div>
      <div class="shift-details-footer">

        <CustomTextButton
          v-if="shift.note && !shift.isEditingNote"
          label="edit note"
          :width="80"
          :padding="2"
          :margin="2"
          @click="showNoteEditor(shift)"
        />
        <CustomTextButton
          v-else-if="!shift.isEditingNote"
          label="add note"
          :width="80"
          :padding="2"
          :margin="2"
          @click="showNoteEditor(shift)"
        />

        <CustomTextButton
          v-if="shift.isEditingNote"
          label="save note"
          :width="80"
          :padding="2"
          :margin="2"
          @click="submitForm"
          style="margin-left: auto"
        />

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
  background-color: var(--color-background-soft);
  color: #fff;
  text-align: center;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 16px 20px 50px 10px #222222;
}

.shift-details-container {
  display: grid;
  grid-template-rows: 70% 30%;
  margin: 0 0 10px 0;
  padding: 5px;
}

.shift-delete-confirm {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 50%;
  height: 150px;
  z-index: 1001;
  background-color: #797979;
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin: auto;
}

.shift-delete-confirm-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.shift-details {
  display: grid;
  grid-template-columns: 40% 60% ;
  padding: 5px;
  font-size: 13px;
  height: 150px;
  border-radius: 5px;
  background: var(--color-background-mute);
}

.shift-details-footer {
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-items: center;
  background: var(--color-background-soft);
  border-radius: 0 0 5px 5px;
}

.shifts-label {
  display: block;
  text-align: left;
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

#noteEditor {
  max-width: 500px;
}

.shift-delete {
  height: 25px;
  filter: invert(40%);
}

.shift-delete:hover {
  cursor: pointer;
  filter: invert(100%)
}



@media (max-width: 800px) {
  #noteEditor {
    max-width: 300px;
  }

  .shifts-container {
    padding: 15px;
  }

  .shift-delete {
    height: 20px;
  }
}
</style>
