<script setup>

import {ref} from "vue";
import DayOFFDetails from "@/components/pages/userPanel/modals/ShiftDetails/DayOFFDetails.vue";
import DetailsDropdown from "@/components/pages/userPanel/modals/ShiftDetails/DetailsDropdown.vue";


const isDayOffDropdownOpen = ref(false)

const toggleDayOffDropdown = (buttonStatus) => {
  isDayOffDropdownOpen.value = buttonStatus
}

</script>

<template>
   <div
      class="items-center m-3
      border-2 rounded-lg
      overflow-auto
      w-[95%]
      "
      :class="isDayOffDropdownOpen ? 'border-silver bg-secondary' : 'border-third'"
  >
     <div
        class="grid grid-cols-[1fr_auto] items-center"
        :class="!isDayOffDropdownOpen ? 'hover:bg-secondary' : 'hover:bg-none'"
    >

       <DetailsDropdown
         @open="toggleDayOffDropdown"
       >
         <div class="flex flex-grow justify-left items-center w-full">
            <p class="text-left text-xl text-silver font-bold m-2">Day off</p>

          </div>
       </DetailsDropdown>

     </div>

    <DayOFFDetails
      :is-open="isDayOffDropdownOpen"
    />

   </div>
</template>

<style scoped>
</style>