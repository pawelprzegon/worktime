<script setup>

import {onMounted, defineProps, computed} from "vue";
import {startShift, endShift, getActiveShift} from "@/fetchers.js";


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
      const endResponse = await endShift(shiftId, userId)
      console.log(endResponse)
      props.user.activeShift = null
    } else {
      const endResponse = await startShift(userId, note)
      console.log(endResponse)
      await checkActiveShift()
    }

  } catch (error) {
    console.error("Error fetching stopShift:", error);
  }
}

const avatarSrc = computed(() => {
  return new URL(`../assets/avatar/${props.user.avatar}`, import.meta.url).href;
});
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
  <div class="dash-user">

    <img
        :class="{'avatar': true, 'off': !props.user.activeShift}"
        :src="avatarSrc"
        alt="avatar"
        @click="shiftToggle"
    >

    <section
        :class="{'user-section': true, 'active': props.user.activeShift}"
    >
      <p class="label">{{props.user.first_name}}</p>
      <p class="label">{{props.user.last_name}}</p>
    </section>

    <section>
      <p class="shift" id="shift" v-if="props.user.activeShift">{{ props.user.shiftDuration }}</p>
    </section>

  </div>



</template>

<style scoped>

.dash-user {
  display: grid;
  grid-template-rows: 2fr auto 50px;
  gap: 15px;
  justify-items: center;
}

.avatar {
  width: 150px;
  height: auto;
  margin: auto;
}

.avatar:hover {
  cursor: pointer;
  filter: grayscale(50%);
}

.off {
  filter: grayscale(100%);
}

.user-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.label {
  font-size: 1.5rem;
}

.active {
  color: white;
}

.shift {
  font-size: 1rem;

}

</style>