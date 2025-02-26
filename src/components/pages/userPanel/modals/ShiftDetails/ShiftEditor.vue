<script setup>

import {formatTime, getLastCorrectionUpdate, getTime} from "@/composables/utils.js";
import ShiftDetailContainer from "@/components/pages/userPanel/ShiftDetailContainer.vue";
import DetailsDropdown from "@/components/pages/userPanel/modals/ShiftDetails/DetailsDropdown.vue";
import ShiftDetails from "@/components/pages/userPanel/modals/ShiftDetails/ShiftDetails.vue";
import {ref, onMounted, computed} from "vue";
import CustomIconButton from "@/components/CustomIconButton.vue";
import {useScreenSizeStore, useSelectedMonthStore} from "@/stores/utilsStore.js";
import DeleteShiftConfirm from "@/components/pages/userPanel/modals/ShiftDetails/DeleteShiftConfirm.vue";
import {usedayStore} from "@/stores/calendarStore.js";



const screenSize = useScreenSizeStore()
const monthStore = useSelectedMonthStore('calendar');
const dayStore = usedayStore();

const props = defineProps({
  shiftId: {
    type: String,
    required: true
  },
  index: Number,
  closeModal: Function
})

const shift = dayStore.getShiftById(props.shiftId)

const isDeleteOpen = ref(false)
const isShiftsDropdownOpen = ref(false)


const toggleShiftDropdown = (buttonStatus) => {
  isShiftsDropdownOpen.value = buttonStatus
}



const handleDeleteShiftOpen = async (isOpen) => {
  isDeleteOpen.value = isOpen
}

const start = computed(() =>
  shift.value.update?.length > 0
    ? getLastCorrectionUpdate(shift.value).start
    : shift.value?.start
);

const stop = computed(() =>
  shift.value.update?.length > 0
    ? getLastCorrectionUpdate(shift.value).stop
    : shift.value?.stop
);


onMounted(async () => {
  screenSize.setSize(window.innerWidth);
  window.addEventListener('resize', screenSize.setSize(window.innerWidth));
});


</script>

<template>

  <div
      class="inline-grid items-center
      border-2 rounded-lg
      overflow-auto
      w-[95%]
      m-1
      "
      :class="isShiftsDropdownOpen ? 'border-silver bg-primary' : 'border-pigeon'"
  >

    <div
        class="grid grid-cols-[1fr_auto] items-center w-full"
        :class="!isShiftsDropdownOpen ? 'hover:bg-secondary' : 'hover:bg-none'"
    >

      <DeleteShiftConfirm
        v-show="isDeleteOpen"
        :shift-id=shift.id
        :open-handler="handleDeleteShiftOpen"
      />

      <DetailsDropdown
          v-show="!isDeleteOpen"
          @open="toggleShiftDropdown"
      >
        <div class="flex flex-grow justify-between items-center w-full">

          <p
              class="
              text-2xl m-2 text-silver font-bold p-1 w-[30px]

              portrait-2xs:m-0 portrait-2xs:p-0
              portrait-medium:m-1
              "
          >{{props.index}}</p>

          <div
              class="
              flex gap-5

              portrait-2xs:text-xs portrait-2xs:flex-cols
              portrait-medium:text-base portrait-medium:flex-row
              "
          >

              <ShiftDetailContainer
                :time="getTime(start)"
                :text="Object({color: 'emerald-500', weight: 'bold'})"
                :justify="'center'"
                :orient="!screenSize.isPortraitSmall ? 'row' : 'col'"
              />


              <ShiftDetailContainer
                :time="getTime(stop)"
                :text="Object({color: 'red-500', weight: 'bold'})"
                :justify="'center'"
                :orient="!screenSize.isPortraitSmall ? 'row' : 'col'"
              />


              <ShiftDetailContainer
                :time="formatTime(shift.work)"
                :text="Object({color: 'silver', weight: 'bold'})"
                :justify="'center'"
                :orient="!screenSize.isPortraitSmall ? 'row' : 'col'"
              />

          </div>

          <CustomIconButton
              v-show="!monthStore.selected.closed"
              icon="trash-bin.png"
              @click.stop="handleDeleteShiftOpen(true)"
              height="15"
              width="15"
          />

        </div>

      </DetailsDropdown>

    </div>

    <ShiftDetails
        :shift-id=shiftId
        :is-open="isShiftsDropdownOpen"
    />

  </div>

</template>

<style scoped>

</style>