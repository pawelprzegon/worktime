<script setup>

import DetailsContainer from "@/components/pages/userPanel/DetailsContainer.vue";
import CustomTextButton from "@/components/CustomTextButton.vue";
import {ref} from "vue";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {useDayStore} from "@/stores/calendarStore.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {deleteShiftFetch, setShiftOFF} from "@/composables/fetchers.js";
import {daysOff, leaveTypes, other} from "@/data/PDF_leaveType_data.js";

const dataList = ['UW', 'UB', 'UŻ', 'L4', 'CD']
const selectedOFF = ref(null)
const monthStore = useSelectedMonthStore('calendar')
const dayStore = useDayStore()
const alert = useAlertStore()


const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  }
});

const mapDescription = (code) => {
  const allSources = [...leaveTypes, ...daysOff, ...other];
  return allSources.find(item => item.code === code) || null;
};

const handleSaveOFF = async () => {
   const responseMessage = {
      status: '',
      message: ''
    }
  try{

    const response = setShiftOFF(selectedOFF.value, dayStore.date)

    await monthStore.refresh()
    await dayStore.refresh()

    responseMessage.status = response.status
responseMessage.message = response.message

  } catch (error) {
    responseMessage.status  = "error"
    responseMessage.message = error.message
  } finally {
    alert.show(responseMessage.status, responseMessage.message)
  }

}

const handleRemoveOFF = async () => {
   const responseMessage = {
      status: '',
      message: ''
    }
  try{
    const shiftId = dayStore.list.filter(s => s.offType !== null)[0].id
    const response = deleteShiftFetch(shiftId)

    await monthStore.refresh()
    await dayStore.refresh()

    responseMessage.status = response.status
    responseMessage.message = response.message

  } catch (error) {
    responseMessage.status  = "error"
    responseMessage.message = error.message
  } finally {
    alert.show(responseMessage.status, responseMessage.message)
  }

}

const checkOffDay = () => {
  return dayStore.list?.filter(s => s.off_type !== null).length > 0 || false;
}

const getReason = () => {
  return dayStore.list.filter(s => s.off_type !== null)[0].off_type
}

const isDayOFFActive = () => {
  return dayStore.regular + dayStore.overtime < 28800;
}


</script>

<template>

  <div
      v-show="isDayOFFActive() && !monthStore.selected.closed"
      :class="[
      'transition-all duration-500 ease-in-out overflow-auto',
      props.isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
      ]"
  >

    <div v-if="!checkOffDay()" class="grid grid-cols-[1fr_auto] items-center bg-secondary">

        <section class="text-white flex justify-center items-center box-border rounded-md p-3">
          <label class="m-3 text-base w-fit" for="lista">Holiday type:</label>
          <select
              class="text-black w-20"
              id="lista"
              name="lista"
              v-model="selectedOFF"

          >
            <option
                class="text-black"
                v-for="(element, index) in dataList"
                :key="index"
                :value="element"
            >
              {{element}}
            </option>
          </select>
        </section>

        <CustomTextButton
            label="save"
            @click="handleSaveOFF"
        />

        <div class="grid gap-1 grid-flow-row justify-center align-middle">

         <DetailsContainer v-for="element in dataList" :label=element :data=mapDescription(element)?.description />

       </div>
      </div>

    <div v-else
           class="grid grid-cols-[1fr_auto] items-center bg-secondary">

         <section
             class="m-3"
         >

           <h1 class="m-3">Day Off:</h1>
           <p class="text-3xl">{{getReason()}}</p>

         </section>

          <CustomTextButton
              v-show="!monthStore.selected.closed"
              label="remove"
              @click="handleRemoveOFF"
          />

          <div class="grid gap-1 grid-flow-row justify-center align-middle">
            <DetailsContainer :label=getReason() :data=mapDescription(getReason())?.description />
          </div>
      </div>

  </div>

</template>

<style scoped>

</style>