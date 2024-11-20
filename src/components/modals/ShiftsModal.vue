<script setup>
import {defineEmits, computed, ref, inject} from 'vue';
import {formatTime, getDate, getTime} from "@/utils.js";
import ShiftDetailContainer from "@/components/panel/ShiftDetailContainer.vue";
import ShiftNoteContainer from "@/components/panel/ShiftNoteContainer.vue";
import CustomTextButton from "@/components/utils/CustomTextButton.vue";
import {saveShiftNote, shiftCorrection} from "@/fetchers.js";
import Alert from "@/components/utils/Alert.vue";
import '@vuepic/vue-datepicker/dist/main.css'
import TimeCorrector from "@/components/panel/TimeCorrector.vue";
import '@/assets/modal.css';


const alert = inject('alert');
const deleteConfirmationVisible = ref(false)
const selectedNewDateTime = ref('')
const selectedStartOrStop = ref('')

const emit = defineEmits(['closeModal', 'removeShift', 'refreshModal'])

const props = defineProps({
  shifts: {
    type: Array,
    default: () => []
  }
})

const resetModalState = () => {
  selectedNewDateTime.value = '';
  selectedStartOrStop.value = '';
};

props.shifts.forEach(shift => {
  shift.isCorrectingTime = false;
  shift.isEditingNote = false;
  shift.noteContent = shift.note || '';
});

const date = computed(() => {
  if (props.shifts.length > 0) {
    return props.shifts[0].start.split("T")[0];
  }
  return '';
});

const toggleShowNoteEditor = (shift) => {
  shift.isEditingNote = !shift.isEditingNote
}

const toggleShowTimeCorrector = (shift) => {
  shift.isCorrectingTime = !shift.isCorrectingTime
}

const handleButtonClick = (shift) => {
  if (!shift.isCorrectingTime) {
    selectedNewDateTime.value = ''
    toggleShowTimeCorrector(shift);
  } else {
    saveCorrection(shift);
  }
};

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

const rewriteNewDateTime = (selectedDateTime) => {
  selectedNewDateTime.value = selectedDateTime
}

const rewriteNewStartStop = (startOrStop) => {
  selectedStartOrStop.value = startOrStop
}

const saveCorrection = async (shift) => {
  if (selectedNewDateTime.value && selectedStartOrStop.value) {
    const response = await shiftCorrection(shift.id, shift.user_id, selectedNewDateTime.value, selectedStartOrStop.value)
    alert.show(response.status, response.message)
    emit('refreshModal')
    return
  }
  if (!selectedStartOrStop.value) {
    alert.show('error', 'Select start or stop')
  }
  else {
    alert.show('error', 'Select date and hour')
  }
}

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

const closeModal = () => {
  resetModalState()
  emit('closeModal')
}


</script>

<template>
  <Alert />
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div
          v-if="props.shifts.length > 0"
          class="shifts-container"
      >
        <div class="shifts-label">
          <h2 style="font-weight: 600">{{ date }}</h2>
        </div>

        <div
            v-for="shift in props.shifts"
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
              @click.self="shift.isEditingNote = false"
          >

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
          </div>

          <TimeCorrector
           :isActive="shift.isCorrectingTime"
           :default-start="shift.start"
           :default-stop="shift.stop"
           :corrections="shift.time_correction"
           @newStartStop="rewriteNewStartStop"
           @newDateTime="rewriteNewDateTime"
          />

          <div class="shift-details-footer">

            <section
                 v-if="!deleteConfirmationVisible"
                class="shift-details-footer">

              <CustomTextButton
                v-if="!shift.isEditingNote && !shift.isCorrectingTime"
                :label="'correct'"
                :width="80"
                :padding="2"
                :margin="2"
                @click="handleButtonClick(shift)"
              />

              <CustomTextButton
                v-if="!shift.isEditingNote && shift.isCorrectingTime && selectedNewDateTime"
                :label="'save'"
                :width="80"
                :padding="2"
                :margin="2"
                @click="handleButtonClick(shift)"
              />

              <CustomTextButton
                  v-if="shift.isCorrectingTime"
                  label="cancel"
                  :width="80"
                  :padding="2"
                  :margin="2"
                  @click="shift.isCorrectingTime = false"
              />

            </section>


            <section
                v-if="!deleteConfirmationVisible"
                class="shift-details-footer">

              <CustomTextButton
                v-if="shift.note && !shift.isEditingNote && !shift.isCorrectingTime"
                label="edit"
                :width="80"
                :padding="2"
                :margin="2"
                @click="toggleShowNoteEditor(shift)"
              />
              <CustomTextButton
                v-else-if="!shift.isEditingNote && !shift.isCorrectingTime"
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



            <img
              v-if="!deleteConfirmationVisible"
              class="shift-delete"
              src="@/assets/img/delete.png"
              alt="delete"
              @click="deleteConfirmationVisibleToggle(shift.id)"
            >

          </div>
        </div>
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
  height: fit-content;
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


  .has-corrections::after {
    top: 1px;
    right: 5px;
    width: 4px;
    height: 4px;
  }

}

@media (max-width: 600px) {
  #noteEditor {
    max-width: 300px;
  }

  .shifts-container {
    padding: 15px;
  }

  .shift-delete {
    height: 20px;
  }

  .shift-details {
    grid-template-columns: 50% 50%;
  }

  .has-corrections::after {
    top: 1px;
    right: 5px;
    width: 4px;
    height: 4px;
  }

}


</style>
