<script setup>

import {onMounted, defineProps} from "vue";
import {startShift, endShift, getActiveShift, saveShiftNote} from "@/fetchers.js";
import Avatar from "@/components/user/Avatar.vue";
import UserName from "@/components/user/UserName.vue";
import ShiftTime from "@/components/user/ShiftTime.vue";


const props = defineProps({
  user: Object,
})

const checkActiveShift = async () => {
  try{
    const active = await getActiveShift(props.user._id)
    props.user.activeShift = active
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

const shiftToggle = async () => {

  const userId = props.user._id
  const note = 'test Note'
  try{

    if (props.user.activeShift) {
      const shiftId = props.user.activeShift._id
      await endShift(shiftId, userId)
      props.user.activeShift = null
    } else {
      await startShift(userId, note)
      await checkActiveShift()
    }

  } catch (error) {
    console.error("Error fetching stopShift:", error);
  }
}


const saveNote = async (note) => {
  console.log(note + ' to save')
  try{
    const response = await saveShiftNote(props.user._id, props.user.activeShift._id, note)
    console.log(response)
  } catch (error) {
    console.error("Error fetching saveShiftNote:", error);
  }

}


onMounted(async () => {
  try {
    await checkActiveShift()
    updateShiftTimes()
    setInterval(updateShiftTimes, 1000);
    console.log(props.user.avatar)
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});
</script>

<template>
  <div :class="{'user': true, 'active': props.user.activeShift}">

    <Avatar
        :avatar_url="props.user.avatar"
        :active-shift="props.user.activeShift"
        @toggle="shiftToggle"
    />

    <UserName
        :first-name="props.user.first_name"
        :last-name="props.user.last_name"
    />

    <ShiftTime
        :active-shift="props.user.activeShift"
        :shift-duration="props.user.shiftDuration"
        @pass-note="saveNote"
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
  background: #212121;
  border-radius: 10px;
}


</style>