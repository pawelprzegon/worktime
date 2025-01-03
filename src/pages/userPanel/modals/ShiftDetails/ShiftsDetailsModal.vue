<script setup>
import {ref} from 'vue';
import '@vuepic/vue-datepicker/dist/main.css'
import {formatTime, getDateString} from "@/composables/utils.js";
import ModalWrapper from "@/components/ModalWrapper.vue";
import ShiftDetailsRow from "@/pages/userPanel/modals/ShiftDetails/ShiftDetailsRow.vue";
import {useDailyShiftsList} from "@/stores/calendarStore.js";
import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";
import OvertimeContainer from "@/pages/userPanel/modals/ShiftDetails/OvertimeContainer.vue";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";

const monthStore = useSelectedMonthStore('calendar');
const dailyShifts = useDailyShiftsList();
const isModalOpen = ref(true);

const props = defineProps({
  closeModal: Function,
})

const closeModal = () => {
  props.closeModal();
  isModalOpen.value = false;
}

const dt = getDateString(dailyShifts.date)

const isToilActive = () => {
  return dailyShifts.selectedDay.regular + dailyShifts.selectedDay.overtime < 28800;
}

</script>

<template>
  <ModalWrapper v-show="isModalOpen" :close-modal="closeModal">

      <div
          class="
          bg-soft shadow-2xl text-white box-border rounded-md p-3
          w-[75vw] max-w-[600px] min-w-[250px] max-h-[80vh] overflow-auto
          ">

        <div class="shifts-label">

          <h2
              class="
              font-bold

              portrait-2xs:text-sm
              portrait-medium:text-base
              portrait-xl:text-lg
              "
          >
            {{ dt }}
          </h2>

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
            :label="'TOIL taken'"
            :time="formatTime(dailyShifts.selectedDay.toil?.duration_seconds || 0)"
            :orient="'row'"
            :text-color="dailyShifts.selectedDay.toil?.duration_seconds ? 'turquoise' : 'stone-700'"
          />

          <!-- Sekcja nadgodzin -->
          <div
              v-show="isToilActive()"
              class="rounded-md m-3 border border-third">
            <OvertimeContainer :shifts="dailyShifts.selectedDay.shiftsList"/>
          </div>
        </div>

<!--         Shifts List-->
        <p class="text-left text-xl">Shifts:</p>

        <ShiftDetailsRow
            v-for="(shift, index) in dailyShifts.selectedDay.shiftsList"
            :key=index
            :shift="shift"
            :index="index+1"
            :closeModal="closeModal"
        />

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
