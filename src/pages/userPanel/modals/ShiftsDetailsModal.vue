<script setup>
import {ref} from 'vue';
import '@vuepic/vue-datepicker/dist/main.css'
import {formatTime, getDateString} from "@/composables/utils.js";
import ModalWrapper from "@/components/ModalWrapper.vue";
import ShiftDetailsRow from "@/pages/userPanel/modals/ShiftDetailsRow.vue";
import {useDailyShiftsList} from "@/stores/calendarStore.js";
import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";

const dailyShifts = useDailyShiftsList();
const isModalOpen = ref(true);

const emit = defineEmits(['closeModal', 'removeShift', 'refreshModal', 'refreshCalendar'])

const props = defineProps({
  closeModal: Function,
})

const closeModal = () => {
  props.closeModal();
  isModalOpen.value = false;
}

const dt = getDateString(dailyShifts.date)

const refreshCalendar = () => {
  emit('refreshCalendar')
}

</script>

<template>
  <ModalWrapper v-if="isModalOpen" :close-modal="closeModal">
      <div class="shifts-container">
        <div class="shifts-label">
          <h2 class="font-bold text-2xl">{{ dt }}</h2>

          <ShiftDetailContainer
            :label="'regular time'"
            :time="formatTime(dailyShifts.selectedDay.regular)"
            :orient="'row'"
          />

          <ShiftDetailContainer
            :label="'overtime'"
            :time="formatTime(dailyShifts.selectedDay.overtime)"
            :orient="'row'"
            :text-color="dailyShifts.selectedDay.overtime > 0 ? 'overtime' : 'stone-700'"
          />

          <ShiftDetailContainer
            :label="'TOIL hours taken'"
            :time="formatTime(dailyShifts.selectedDay.toil?.hours * 3600 || 0)"
            :orient="'row'"
          />
        </div>

        <ShiftDetailsRow
            v-for="(shift, index) in dailyShifts.selectedDay.shiftsList"
            :key=index
            :shift-id="shift.id"
            :index="index+1"
            @refreshCalendar="refreshCalendar"
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
