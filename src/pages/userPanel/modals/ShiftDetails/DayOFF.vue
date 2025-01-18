<script setup>


import {ref} from "vue";
import CustomTextButton from "@/components/CustomTextButton.vue";
import {setShiftOFF, deleteShiftFetch} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {usedayStore} from "@/stores/calendarStore.js";
import DetailsContainer from "@/pages/userPanel/DetailsContainer.vue";
import {leaveTypes, daysOff, other} from "@/data/PDF_leaveType_data.js";

const dataList = ['UW', 'UB', 'UŻ', 'L4', 'CD']
const selectedOFF = ref(null)
const monthStore = useSelectedMonthStore('calendar')
const dayStore = usedayStore()
const alert = useAlertStore()

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

const mapDescription = (code) => {
  const allSources = [...leaveTypes, ...daysOff, ...other];
  return allSources.find(item => item.code === code) || null;
};

</script>

<template>
   <div
      class="items-center m-3 border-silver bg-secondary
      border-2 rounded-lg
      overflow-auto
      w-[95%]
      "
  >

    <div v-if="!checkOffDay()"
        class="grid grid-cols-[1fr_auto] items-center bg-secondary">

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