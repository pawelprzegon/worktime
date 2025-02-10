<script setup>

import {onMounted, ref, watch} from "vue";
import {startShift, stopShift} from "@/composables/fetchers.js";
import Avatar from "@/components/Avatar.vue";
import UserName from "@/components/UserName.vue";
import ShiftTime from "@/components/pages/dash/ShiftTime.vue";
import ShiftToggleModal from "@/components/pages/dash/ShiftToggleModal.vue";
import {useActiveShifts} from "@/stores/shiftStore.js";
import Spinner from "@/components/Spinner.vue";
import {useAlertStore} from "@/stores/alertStore.js";
import Alert from "@/components/Alert.vue";


const alert = useAlertStore()
const activeShifts = useActiveShifts()

const props = defineProps({
  user: Object,
  checkActiveShift: Function
})

const activeShift = ref(null)
const activeShiftDuration = ref(null)
const isLoading = ref(true)

const modalVisibility = ref(false)

const toggleModalVisibility = () => {
  modalVisibility.value = !modalVisibility.value
}

const calculateShift = (shiftStart) => {
  const currentTime = new Date();
  const shiftStartTime = new Date(shiftStart);

  const diff = currentTime - shiftStartTime;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const updateShiftTimes = () => {
  if (activeShift.value) {
    activeShiftDuration.value = calculateShift(activeShift.value.start);
  }
  isLoading.value = false;
};

const toggleShift = async () => {

  const userId = props.user.id
  const note = ''
  try{

    if (activeShift.value) {
      const shiftId = activeShift.value.id
      const response = await stopShift(shiftId, userId)
      alert.show(response.status, response.message)
      activeShift.value = null
    } else {
      const response =  startShift(userId, note)
      alert.show(response.status, response.message)
      await props.checkActiveShift()
    }

  } catch (error) {
    alert.show("error", error.message)
  } finally {
    toggleModalVisibility()
  }
}

onMounted(async () => {
  try {
    setInterval(updateShiftTimes, 1000);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

watch(() => activeShifts.activeShifts, (update) => {
    if (update) {
      const foundShift = activeShifts.activeShifts.find(shift => shift.user_id === props.user.id);
      if (foundShift){
        activeShift.value = foundShift
      }
    }
  });

const closeModal = () => {
  modalVisibility.value = false;
};

</script>

<template>
  <Alert />
   <div
    :class="[
      'grid grid-rows-[2fr_auto_40px] gap-1 justify-items-center p-1',
      {
        'text-platinum bg-secondary rounded-lg shadow-lg shadow-neutral-900': activeShift,
        'hover:text-white hover:bg-dark-green hover:rounded-lg hover:shadow-lg hover:shadow-neutral-900': true
      }
    ]"
  >

    <Avatar
        :avatar="props.user.avatar"
        :active-shift="activeShift"
        @toggle="toggleModalVisibility"
    />

    <UserName
        :first-name="props.user.first_name"
        :last-name="props.user.last_name"
    />

    <div v-if="activeShift ? isLoading : null" class="loading-spinner">
      <Spinner
          :height=30
          :width=30
      />
    </div>

    <ShiftTime
        v-else
        :active-shift="activeShift"
        :shift-duration="activeShiftDuration"
    />

    <ShiftToggleModal
        v-if="modalVisibility"
        :user="props.user"
        :active-shift="activeShift"
        :close-modal="closeModal"
        @toggleShift="toggleShift"
    />
    
  </div>

</template>

<style scoped>



</style>