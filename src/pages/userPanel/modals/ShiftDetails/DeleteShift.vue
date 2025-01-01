<script setup>

import CustomTextButton from "@/components/CustomTextButton.vue";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useDailyShiftsList} from "@/stores/calendarStore.js";

const monthStore = useSelectedMonthStore('calendar')
const dailyShifts = useDailyShiftsList();
const alert = useAlertStore()

const props = defineProps({
  shiftId: String,
  openHandler: Function,
  closeModal: Function
})

const handleConfirmDelete = async (deleteStatus) => {

  if (deleteStatus) {
    props.openHandler(false)
    const response = await dailyShifts.removeShift(props.shiftId)
    alert.show(response.status, response.message)
    if (dailyShifts.selectedDay.shiftsList.length <= 0){
      props.closeModal()
    }
    await monthStore.refresh()
  }

}

</script>

<template>
  <div class="flex flex-grow justify-between items-center w-full bg-red-500">
    <p class="mx-2">Delete Shift?</p>

    <div class="w-[30%] inline-flex justify-between">
      <CustomTextButton
        label="Yes"
        @click="handleConfirmDelete(true)"
      />
      <CustomTextButton
        label="No"
        @click="handleConfirmDelete(false)"
      />

    </div>

  </div>

</template>

<style scoped>

</style>