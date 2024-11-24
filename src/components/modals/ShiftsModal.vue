<script setup>
import {computed, ref, onBeforeUnmount} from 'vue';
import CustomTextButton from "@/components/utils/CustomTextButton.vue";
import Alert from "@/components/utils/Alert.vue";
import '@vuepic/vue-datepicker/dist/main.css'
import CorrectorContainer from "@/components/panel/details/CorrectorContainer.vue";
import '@/assets/modal.css';
import OvertimeConsumer from "@/components/panel/details/OvertimeContainer.vue";
import MainContainer from "@/components/panel/details/mainContainer.vue";

const deleteConfirmationVisible = ref(false)


const emit = defineEmits(['closeModal', 'removeShift', 'refreshModal'])

const props = defineProps({
  shifts: {
    type: Array,
    default: () => []
  },
  overtime: Object,
  calculatedOvertime: {
    type: Number,
    default: 0
  },
  selectedDay: Date,
})

props.shifts.forEach(shift => {
  shift.isCorrectingTime = false;
  shift.isEditingNote = false;
  shift.isOverTime = false;
  shift.isMainSelected = true;
  shift.isCorrectSelected = false;
  shift.isOvertimeSelected = false;
  shift.noteContent = shift.note || '';
});

const date = computed(() => {
  const newDate = new Date(props.selectedDay);
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

const toggleSelectedCard = (shift, selected) => {
  shift.isMainSelected = false;
  shift.isOvertimeSelected = false;
  shift.isCorrectSelected = false;

  switch (selected) {
    case 'main':
      shift.isMainSelected = true;
      break;
    case 'correct':
      shift.isCorrectSelected = true;
      break;
    case 'overtime':
      shift.isOvertimeSelected = true;
      break;
  }
}

const summaryWorkTime = () => {
  let summaryWork = 0
  props.shifts.forEach(shift => {
    summaryWork += shift.work
  })
  return summaryWork
}


const deleteConfirmationVisibleToggle = (shiftId) => {
  deleteConfirmationVisible.value = deleteConfirmationVisible.value === shiftId ? null : shiftId;
}

const refreshModal = () => {
  emit('refreshModal')
}

const deleteConfirmed = (shiftId) => {
  emit('removeShift', shiftId)
}


const closeModal = () => {
  emit('closeModal')
}

onBeforeUnmount(() => {
  props.shifts.forEach(shift => {
    shift.isEditingNote = false
  })
})

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
              @click.self="shift.isEditingNote = false"
          >

            <div class="shift-details-header">
              <p :class="['card-button', { selected: shift.isMainSelected }]" @click="toggleSelectedCard(shift, 'main')">main</p>
              <p :class="['card-button', { selected: shift.isCorrectSelected }]" @click="toggleSelectedCard(shift, 'correct')">correct</p>
            </div>

            <MainContainer
              v-if="shift.isMainSelected"
              :shift="shift"
              @refreshModal="refreshModal"
            />

            <CorrectorContainer
              v-if="shift.isCorrectSelected"
              :shift="shift"
              @refreshModal="refreshModal"
            />


          </div>



<!--            <img-->
<!--            v-if="!deleteConfirmationVisible"-->
<!--            class="shift-delete"-->
<!--            src="@/assets/img/delete.png"-->
<!--            alt="delete"-->
<!--            @click="deleteConfirmationVisibleToggle(shift.id)"-->
<!--          >-->


        </div>
        <OvertimeConsumer
            :maxToTake="summaryWorkTime()"
            :overtime="props.overtime"
            :monthOvertimes="props.calculatedOvertime"
            :date="date"
            @refreshModal="refreshModal"
        />
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

.shifts-label {
  display: block;
  text-align: left;
}

.shift-delete {
  height: 25px;
  filter: invert(40%);
}

.shift-delete:hover {
  cursor: pointer;
  filter: invert(100%)
}

.card-button {
  padding: 10px;
  color: var(--color-text-basic);
}

.card-button:hover {
  cursor: pointer;
  color: var(--color-text-active)
}

.selected {
  background: var(--color-background-light);
  border-radius: 5px 5px 0 0;
  color: var(--color-text-active)
}

@media (max-width: 800px) {

  .shifts-container {
    padding: 15px;
  }

  .shift-delete {
    height: 20px;
  }
}


</style>
