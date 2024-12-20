<script setup>

import {onMounted, ref, watch} from "vue";
import {startShift, stopShift} from "@/composables/fetchers.js";
import Avatar from "@/components/Avatar.vue";
import UserName from "@/components/UserName.vue";
import ShiftTime from "@/pages/dash/ShiftTime.vue";
import ShiftToggleModal from "@/pages/dash/ShiftToggleModal.vue";
import {useActiveShifts} from "@/stores/shiftStore.js";
import Spinner from "@/components/Spinner.vue";

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
      await stopShift(shiftId, userId)
      activeShift.value = null
    } else {
      await startShift(userId, note)
      await props.checkActiveShift()
    }

  } catch (error) {
    console.error("Error fetching stopShift:", error);
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
 <div
  :class="[
    'grid grid-rows-[2fr_auto_40px] gap-2 justify-items-center p-1',
    {
      'text-white bg-secondary rounded-lg shadow-lg shadow-neutral-900': activeShift,
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
        :close-modal="closeModal"
        @toggleShift="toggleShift"
    />
    
  </div>

</template>

<style scoped>

.user {
  display: grid;
  grid-template-rows: 2fr auto 50px;
  gap: 10px;
  justify-items: center;
  padding: 3px;
}

.active,
.user:hover {
  color: white;
  background: var(--vt-c-black-mute);
  border-radius: 10px;
  box-shadow: var(--vt-box-shadow);
}

@media (max-width: 1300px) {
  .user {
    grid-template-rows: 100px 30px 50px;
    gap: 3px;
  }
}

@media (max-width: 1000px) {
  .user {
    grid-template-rows: 85px 30px 50px;
    gap: 3px;
  }
}

@media (max-width: 800px) {
  .user {
    grid-template-rows: 75px 30px 50px;
    gap: 3px;
  }
}

@media (max-width: 600px) {
  .user {
    grid-template-rows: 65px 30px 50px;
    gap: 3px;
  }
}


</style>