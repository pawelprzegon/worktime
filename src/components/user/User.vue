<script setup>

import {onMounted, ref} from "vue";
import {startShift, stopShift, getActiveShift, saveShiftNote, deleteShiftFetch} from "@/fetchers.js";
import Avatar from "@/components/user/Avatar.vue";
import UserName from "@/components/user/UserName.vue";
import ShiftTime from "@/components/user/ShiftTime.vue";
import CustomModal from "@/components/modals/CustomModal.vue";
import ToggleModal from "@/components/modals/ToggleModal.vue";


const props = defineProps({
  user: Object,
})

const modalVisibility = ref(false)

const toggleModalVisibility = () => {
  modalVisibility.value = !modalVisibility.value
}

const checkActiveShift = async () => {
  try{
    props.user.activeShift = await getActiveShift(props.user._id)
  } catch (error) {
    console.error("Error fetching getActiveSift:", error);
  }

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
  if (props.user.activeShift) {
    props.user.shiftDuration = calculateShift(props.user.activeShift.start);
  }

};

const toggleShift = async () => {

  const userId = props.user._id
  const note = ''
  try{

    if (props.user.activeShift) {
      const shiftId = props.user.activeShift.id
      await stopShift(shiftId, userId)
      props.user.activeShift = null
    } else {
      await startShift(userId, note)
      await checkActiveShift()
    }

  } catch (error) {
    console.error("Error fetching stopShift:", error);
  } finally {
    toggleModalVisibility()
  }
}



onMounted(async () => {
  try {
    await checkActiveShift()
    updateShiftTimes()
    setInterval(updateShiftTimes, 1000);
    setInterval(async () => {
      await checkActiveShift()
    }, 5000)
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

const closeModal = () => {
  modalVisibility.value = false;
};

</script>

<template>
  <div :class="{'user': true, 'active': props.user.activeShift}">

    <Avatar
        :avatar="props.user.avatar"
        :active-shift="props.user.activeShift"
        @toggle="toggleModalVisibility"
    />

    <UserName
        :first-name="props.user.first_name"
        :last-name="props.user.last_name"
    />

    <ShiftTime
        :active-shift="props.user.activeShift"
        :shift-duration="props.user.shiftDuration"
    />

    <CustomModal
        v-if="modalVisibility"
        :modalComponent="ToggleModal"
        :modalProps="props.user"
        @closeModal="closeModal"
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