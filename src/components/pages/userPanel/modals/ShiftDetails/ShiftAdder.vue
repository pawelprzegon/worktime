<script setup>

import { ref } from 'vue';
import DetailsDropdown from "@/components/pages/userPanel/modals/ShiftDetails/DetailsDropdown.vue";
import ShiftAdderDetails from "@/components/pages/userPanel/modals/ShiftDetails/ShiftAdderDetails.vue";


const isShiftAdderDropdownOpen = ref(false)

const toggleShiftAdderDropdown = (buttonStatus) => {
  isShiftAdderDropdownOpen.value = buttonStatus
}

</script>

<template>
    <div
      class="items-center m-3
      border-2 rounded-lg
      overflow-auto
      w-[95%]
      "
      :class="isShiftAdderDropdownOpen ? 'border-silver bg-secondary' : 'border-third'"
  >

      <div
          class="grid grid-cols-[1fr_auto] items-center"
          :class="!isShiftAdderDropdownOpen ? 'hover:bg-secondary' : 'hover:bg-none'"
      >

        <DetailsDropdown
         @open="toggleShiftAdderDropdown"
       >
         <div class="flex flex-grow justify-left items-center w-full">
            <p class="text-left text-xl text-beb font-bold m-2">Add Shift</p>
         </div>

       </DetailsDropdown>


      </div>

      <ShiftAdderDetails
        :is-open="isShiftAdderDropdownOpen"
      />


    </div>

</template>



<style scoped>
</style>