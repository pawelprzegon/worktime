<script setup>

import CustomTextButton from "@/components/CustomTextButton.vue";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useDayStore} from "@/stores/calendarStore.js";
import {deleteShiftFetch} from "@/composables/fetchers.js";

const monthStore = useSelectedMonthStore('calendar')
const dayStore = useDayStore();
const alert = useAlertStore()

const props = defineProps({
  shiftId: String,
  openHandler: Function,
})

const removeShift = async () => {
  const responseMessage = {
    status: '',
    message: ''
  }
  try {
    const response = await deleteShiftFetch(props.shiftId);

    if (response.status === 'success') {
      dayStore.list = dayStore.list.filter(
        (shift) => shift.id !== props.shiftId
      );
      responseMessage.status = response.status
      responseMessage.message = response.message
    }

  } catch (error) {
    responseMessage.status = 'error'
    responseMessage.message = 'Removing shift failed!'
  } finally {
    alert.show(responseMessage.status, responseMessage.message)
  }
};

const handleConfirmDelete = async (deleteStatus) => {
  if (!deleteStatus) {
    props.openHandler(false)
    return
  }
  await removeShift()
  props.openHandler(false)

  await monthStore.refresh()
  await dayStore.refresh()
}

</script>

<template>
  <div class="flex flex-grow justify-between items-center w-full bg-red-500">

    <p class="mx-2 text-white font-bold">Delete Shift?</p>

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