<script setup>
import {computed, ref} from 'vue';
import '@vuepic/vue-datepicker/dist/main.css'
import {formatTime, getDateString} from "@/composables/utils.js";
import ModalWrapper from "@/components/ModalWrapper.vue";
import {usedayStore} from "@/stores/calendarStore.js";
import ShiftDetailContainer from "@/components/userPanel/ShiftDetailContainer.vue";
import ShiftEditor from "@/components/userPanel/modals/ShiftDetails/ShiftEditor.vue";
import ToilEditor from "@/components/userPanel/modals/ShiftDetails/ToilEditor.vue";
import ShiftAdder from "@/components/userPanel/modals/ShiftDetails/ShiftAdder.vue";
import {useRefreshStore} from "@/stores/refreshStore.js";
import Spinner from "@/components/Spinner.vue";
import DayOFF from "@/components/userPanel/modals/ShiftDetails/DayOFF.vue";
import DetailsContainer from "@/components/userPanel/DetailsContainer.vue";

const dayStore = usedayStore();
const isModalOpen = ref(true);
const refreshStore = useRefreshStore()

const props = defineProps({
  closeModal: Function,
})

const checkOffDay = () => {
  return dayStore.list.filter(s => s.off_type !== null).length > 0
}

const getReason = () => {
  return dayStore.list.filter(s => s.offType !== null)[0]
}

const closeModal = () => {
  props.closeModal();
  isModalOpen.value = false;
}

const dt = getDateString(dayStore.date)

</script>

<template>
  <ModalWrapper v-show="isModalOpen" :close-modal="closeModal">

      <div
          class="
            bg-soft shadow-2xl text-white box-border rounded-md p-3
            w-[75vw] max-w-[600px] max-h-[80vh] overflow-auto
          ">

        <div class="shifts-label">

          <h3 class="text-beb font-bold text-xl">{{dt}}</h3>

        </div>


         <div v-if="refreshStore.status"
              class="flex justify-center items-center inset-0 h-[15vh]"
         >
           <Spinner />
         </div>

         <div v-else
              class="min-h-[15vh] place-items-center"
         >

           <div v-if="!checkOffDay()" class="w-full">

              <ShiftDetailContainer
                  v-show="dayStore.list.length > 0"
                  :label="'regular time'"
                  :time="formatTime(dayStore.regular)"
                  :orient="'row'"
              />

              <ShiftDetailContainer
                  v-show="dayStore.list.length > 0"
                  :label="'overtime'"
                  :time="formatTime(dayStore.overtime)"
                  :orient="'row'"
                  :text-color="dayStore.overtime > 0 ? 'overtime' : 'stone-700'"
              />

             <ShiftEditor
                 v-show="dayStore.list.length > 0"
                 v-for="(shift, index) in dayStore.list"
                 :key=shift.id
                 :shift-id="shift.id"
                 :index="index+1"
                 :closeModal="closeModal"
             />

             <ShiftAdder
                  v-show="dayStore.list.length === 0"
                  :closeModal="closeModal"
              />

            <ToilEditor/>

           </div>

           <DayOFF />

         </div>

      </div>
  </ModalWrapper>
</template>

<style scoped>

</style>
