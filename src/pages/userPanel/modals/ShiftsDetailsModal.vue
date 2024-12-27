<script setup>
import {ref} from 'vue';
import '@vuepic/vue-datepicker/dist/main.css'
import {formatTime, getDateString, getTimeString} from "@/composables/utils.js";
import ModalWrapper from "@/components/ModalWrapper.vue";
import ShiftDetailsRow from "@/pages/userPanel/modals/ShiftDetailsRow.vue";
import {useDailyShiftsList} from "@/stores/calendarStore.js";
import {useSelectedDayStore} from "@/stores/utilsStore.js";

const selectedMonth = useSelectedDayStore('calendarSelectedMonth');
const dailyShifts = useDailyShiftsList();
const isModalOpen = ref(true);

const emit = defineEmits(['closeModal', 'removeShift', 'refreshModal'])

const props = defineProps({
  closeModal: Function,
})

const closeModal = () => {
  props.closeModal();
  isModalOpen.value = false;
}

const dt = getDateString(dailyShifts.shiftsList?.date)

const refreshModal = () => {
  emit('refreshModal')
}

</script>

<template>
  <ModalWrapper v-if="isModalOpen" :close-modal="closeModal">
      <div class="shifts-container">
        <div class="shifts-label">
          <h2 style="font-weight: 600">{{ dt }}</h2>
          <h3>{{formatTime(selectedMonth.calculatedOvertimeTime)}}</h3>
        </div>

        <ShiftDetailsRow
            v-for="(shift, index) in dailyShifts.shiftsList.shifts.list"
            :key=index
            :shift-id="shift.id"
            :index="index+1"
        ></ShiftDetailsRow>

      </div>
  </ModalWrapper>
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
  width: 100%;
  height: 200px;
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

.has-corrections {
  position: relative;
}

.has-corrections::after {
  content: '';
  position: absolute;
  top: 5px;
  right: 5px;
  width: 5px;
  height: 5px;
  background-color: #c41313;
  border-radius: 50%;
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
