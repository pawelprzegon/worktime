<script setup>

import {ref} from "vue";
import {formatTime} from "@/composables/utils.js";
import ToilDetails from "@/components/pages/userPanel/modals/ShiftDetails/ToilDetails.vue";
import DetailsDropdown from "@/components/pages/userPanel/modals/ShiftDetails/DetailsDropdown.vue";
import ShiftDetailContainer from "@/components/pages/userPanel/ShiftDetailContainer.vue";
import {useDayStore} from "@/stores/calendarStore.js";

const dayStore = useDayStore()
const isToilDropdownOpen = ref(false)

const toggleToilDropdown = (buttonStatus) => {
  isToilDropdownOpen.value = buttonStatus
}
</script>

<template>

  <!--Toil-->
  <div
      class="inline-grid items-center m-3
      border-2 rounded-lg
      overflow-auto
      w-[95%]
      "
      :class="isToilDropdownOpen ? 'border-silver bg-secondary' : 'border-third'"
  >

    <div
        class="grid grid-cols-[1fr_auto] items-center"
        :class="!isToilDropdownOpen ? 'hover:bg-secondary' : 'hover:bg-none'"
    >

      <DetailsDropdown
          @open="toggleToilDropdown"
      >

        <div class="flex flex-grow justify-left items-center w-full">
          <p class="text-left text-xl text-silver font-bold m-2">Toil</p>

          <ShiftDetailContainer
            v-if="dayStore.toil.hasOwnProperty('duration_seconds')"
            :label="''"
            :time="formatTime(dayStore.toil?.duration_seconds)"
            :orient="'row'"
            :text-color="dayStore.toil?.duration_seconds ? 'turquoise' : 'stone-700'"
          />
        </div>


      </DetailsDropdown>

    </div>

    <ToilDetails
      :is-open="isToilDropdownOpen"
    />

  </div>

</template>

<style scoped>

</style>