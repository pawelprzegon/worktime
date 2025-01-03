<script setup>

import {formatTime, getLastCorrectionUpdate, getTime, updateScreenSize} from "@/composables/utils.js";
import ShiftDetailContainer from "@/pages/userPanel/ShiftDetailContainer.vue";
import DetailsDropdown from "@/pages/userPanel/modals/ShiftDetails/DetailsDropdown.vue";
import ShiftDetails from "@/pages/userPanel/modals/ShiftDetails/ShiftDetails.vue";
import {ref, onMounted} from "vue";
import CustomIconButton from "@/components/CustomIconButton.vue";
import {useScreenSizeStore, useSelectedMonthStore} from "@/stores/utilsStore.js";
import DeleteShift from "@/pages/userPanel/modals/ShiftDetails/DeleteShift.vue";

const screenSize = useScreenSizeStore()
const monthStore = useSelectedMonthStore('calendar');

const props = defineProps({
  shift: {
    type: Object,
    required: true
  },
  index: Number,
  closeModal: Function
})

const isDeleteOpen = ref(false)
const isDropdownOpen = ref(false)

const toggleDropdown = (buttonStatus) => {
  isDropdownOpen.value = buttonStatus
}

const handleDeleteShiftOpen = async (isOpen) => {
  isDeleteOpen.value = isOpen
}

const start = props.shift.update.length > 0 ? getLastCorrectionUpdate(props.shift).start : props.shift.start
const stop = props.shift.update.length > 0 ? getLastCorrectionUpdate(props.shift).stop : props.shift.stop

onMounted(async () => {
  updateScreenSize(screenSize);
});

</script>

<template>

  <div
      class="inline-grid items-center m-3
      border rounded-lg
      overflow-auto
      w-[95%]
      "
      :class="isDropdownOpen ? 'border-silver bg-secondary' : 'border-third'"
  >

    <div
        class="grid grid-cols-[1fr_auto] items-center w-full"
        :class="!isDropdownOpen ? 'hover:bg-secondary' : 'hover:bg-none'"
    >

      <DeleteShift
        v-show="isDeleteOpen"
        :shift-id=props.shift.id
        :open-handler="handleDeleteShiftOpen"
        :close-modal="closeModal"
      />

      <DetailsDropdown
          v-show="!isDeleteOpen"
          @open="toggleDropdown"
      >
        <div class="flex flex-grow justify-between items-center w-full">

          <p
              class="
              text-2xl m-2 text-beb font-bold p-1 w-[30px]

              portrait-2xs:m-0 portrait-2xs:p-0
              portrait-medium:m-1 portrait-medium:p-1
              "
          >{{props.index}}</p>

          <div
              class="
              flex

              portrait-2xs:text-xs portrait-2xs:flex-cols
              portrait-medium:text-base portrait-medium:flex-row
              "
          >
            <ShiftDetailContainer
              :label="'start'"
              :time="getTime(start)"
              :orient="!screenSize.isPortraitSmall ? 'row' : 'col'"
            />

            <ShiftDetailContainer
              :label="'stop'"
              :time="getTime(stop)"
              :orient="!screenSize.isPortraitSmall ? 'row' : 'col'"
            />

            <ShiftDetailContainer
              :label="'range'"
              :time="formatTime(props.shift.work)"
              :orient="!screenSize.isPortraitSmall ? 'row' : 'col'"
            />
          </div>

          <CustomIconButton
              v-show="!monthStore.selected.closed"
            icon="delete.png"
            @click.stop="handleDeleteShiftOpen(true)"
          />

        </div>

      </DetailsDropdown>

    </div>

    <ShiftDetails
        :shift="props.shift"
        :is-open="isDropdownOpen"
    />

  </div>

</template>

<style scoped>

</style>