<script setup>


import {ref} from "vue";
import CustomTextButton from "@/components/CustomTextButton.vue";
import {setManualShiftOFF} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {usedayStore} from "@/stores/calendarStore.js";

const dataList = ['UW', 'UB']
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
    const response = setManualShiftOFF(selectedOFF.value)

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

</script>

<template>
   <div
      class="inline-grid items-center m-3 border-silver bg-secondary
      border-2 rounded-lg
      overflow-auto
      w-[95%]
      "
  >

    <div class="inline-flex justify-between items-center">

      <section class="select-list-container">
        <label class="select-list-label" for="lista">Holiday type:</label>
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
    </div>
   </div>
</template>

<style scoped>

.select-list-container {
  margin: 5px;
}

.select-list-label {
  margin: 5px;
  color:  white;
  font-size: 15px;
}

</style>